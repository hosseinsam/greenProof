import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'crypto';
import { ChainRegistryAdapter } from '../common/interfaces/chain-registry.adapter';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionType, SubmissionStatus } from '@prisma/client';

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
    private auditService: AuditService
  ) {}

  async create(userId: string, data: CreateSubmissionDto, fileBuffer: Buffer, filename: string) {
    const evidenceHash = createHash('sha256').update(fileBuffer).digest('hex');
    const existing = await this.prisma.submission.findFirst({ where: { evidenceHash } });
    if (existing) {
      throw new BadRequestException('Duplicate evidence upload detected');
    }
    const storagePath = `storage/submissions/${Date.now()}-${filename}`;
    await this.prisma.$executeRawUnsafe(`SELECT 1`);
    await import('fs/promises').then(fs => fs.mkdir('storage/submissions', { recursive: true }));
    await import('fs/promises').then(fs => fs.writeFile(storagePath, fileBuffer));

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
    const submission = await this.prisma.submission.findUnique({ where: { id: submissionId } });
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }
    if (submission.status !== SubmissionStatus.PENDING) {
      throw new BadRequestException('Submission is not pending');
    }

    const amount = GREEN_COIN_REWARDS[submission.type];
    const approved = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: SubmissionStatus.APPROVED,
        reviewedById: reviewerId,
        reviewedAt: new Date()
      }
    });

    const ledger = await this.prisma.greenCoinLedger.create({
      data: {
        userId: approved.userId,
        submissionId: approved.id,
        amount,
        reason: `Approved ${approved.type.toLowerCase().replace('_', ' ')}`
      }
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

    if (IMPACT_UNIT_ELIGIBLE_TYPES.some((type) => type === approved.type)) {
      await this.prisma.impactUnit.create({
        data: {
          projectId: approved.projectId ?? '',
          submissionId: approved.id,
          quantity: 1,
          maturityLevel: 'INITIAL',
          locked: false
        }
      });
    }

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
