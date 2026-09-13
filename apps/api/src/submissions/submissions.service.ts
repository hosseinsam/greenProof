import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { ChainRegistryAdapter } from '../common/interfaces/chain-registry.adapter';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionType, SubmissionStatus } from '@prisma/client';
import { safeEvidenceFilename, writePrivateFile } from '../common/storage/safe-storage';

const GREEN_COIN_REWARDS: Record<SubmissionType, number> = {
  TREE_PLANTED: 5,
  SEED_PLANTED: 2,
  MAINTENANCE: 3,
  SURVIVAL_CHECK: 10,
  COMMUNITY_EVENT: 20
};

const IMPACT_UNIT_ELIGIBLE_TYPES = [SubmissionType.TREE_PLANTED, SubmissionType.SURVIVAL_CHECK] as const;

@Injectable()
export class SubmissionsService {
  constructor(
    private prisma: PrismaService,
    private chainRegistry: ChainRegistryAdapter,
    private auditService: AuditService,
    private config?: ConfigService
  ) {}

  async create(userId: string, data: CreateSubmissionDto, fileBuffer: Buffer, filename: string) {
    const evidenceHash = createHash('sha256').update(fileBuffer).digest('hex');
    const existing = await this.prisma.submission.findFirst({ where: { evidenceHash } });
    if (existing) {
      throw new BadRequestException('Duplicate evidence upload detected');
    }
    const storageRoot = this.config?.get<string>('STORAGE_DIR') ?? './storage';
    const storagePath = await writePrivateFile(storageRoot, 'submissions', safeEvidenceFilename(filename), fileBuffer);

    return this.prisma.submission.create({
      data: {
        userId,
        projectId: data.projectId,
        speciesId: data.speciesId,
        type: data.type,
        title: data.title,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        locationPrecision: data.locationPrecision,
        evidenceFilePath: storagePath,
        evidenceHash,
        status: SubmissionStatus.PENDING
      }
    });
  }

  async findMySubmissions(userId: string) {
    return this.prisma.submission.findMany({
      where: { userId },
      include: { project: true, species: true, reviewedBy: true }
    });
  }

  async findPending() {
    return this.prisma.submission.findMany({
      where: { status: SubmissionStatus.PENDING },
      include: { user: true, project: true, species: true }
    });
  }

  async approve(submissionId: string, reviewerId: string) {
    const { approved, ledger, amount } = await this.prisma.$transaction(async tx => {
      const submission = await tx.submission.findUnique({ where: { id: submissionId } });
      if (!submission) {
        throw new NotFoundException('Submission not found');
      }
      if (submission.status !== SubmissionStatus.PENDING) {
        throw new BadRequestException('Submission is not pending');
      }

      const updated = await tx.submission.updateMany({
        where: { id: submissionId, status: SubmissionStatus.PENDING },
        data: {
          status: SubmissionStatus.APPROVED,
          reviewedById: reviewerId,
          reviewedAt: new Date()
        }
      });
      if (updated.count !== 1) {
        throw new BadRequestException('Submission is not pending');
      }

      const approvedSubmission = await tx.submission.findUniqueOrThrow({ where: { id: submissionId } });
      const rewardAmount = GREEN_COIN_REWARDS[approvedSubmission.type];
      const ledgerEntry = await tx.greenCoinLedger.create({
        data: {
          userId: approvedSubmission.userId,
          submissionId: approvedSubmission.id,
          amount: rewardAmount,
          reason: `Approved ${approvedSubmission.type.toLowerCase().replace('_', ' ')}`
        }
      });

      if (IMPACT_UNIT_ELIGIBLE_TYPES.some((type) => type === approvedSubmission.type)) {
        if (!approvedSubmission.projectId) {
          throw new BadRequestException('Approved impact submissions must belong to a project');
        }
        await tx.impactUnit.create({
          data: {
            projectId: approvedSubmission.projectId,
            submissionId: approvedSubmission.id,
            quantity: 1,
            maturityLevel: 'INITIAL',
            locked: false
          }
        });
      }

      return { approved: approvedSubmission, ledger: ledgerEntry, amount: rewardAmount };
    });

    const chainResult = await this.chainRegistry.mintGreenCoins({
      userId: approved.userId,
      amount,
      reason: ledger.reason
    });
    await this.prisma.greenCoinLedger.update({
      where: { id: ledger.id },
      data: { chainTxHash: chainResult.txHash }
    });

    await this.auditService.record(reviewerId, 'approve_submission', 'Submission', approved.id, {
      status: approved.status,
      amount
    });

    return approved;
  }

  async reject(submissionId: string, reviewerId: string, rejectionReason: string) {
    const submission = await this.prisma.submission.findUnique({ where: { id: submissionId } });
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }
    if (submission.status !== SubmissionStatus.PENDING) {
      throw new BadRequestException('Submission is not pending');
    }
    const rejected = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: SubmissionStatus.REJECTED,
        rejectionReason: rejectionReason,
        reviewedById: reviewerId,
        reviewedAt: new Date()
      }
    });
    await this.auditService.record(reviewerId, 'reject_submission', 'Submission', rejected.id, { rejectionReason });
    return rejected;
  }
}
