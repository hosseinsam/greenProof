import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChainRegistryAdapter, ChainCertificateStatus, ChainTxResult } from '../common/interfaces/chain-registry.adapter';
import { randomUUID, createHash } from 'crypto';

@Injectable()
export class MockCosmosRegistryAdapter extends ChainRegistryAdapter {
  constructor(private prisma: PrismaService) {
    super();
  }

  private createHash(input: string) {
    return createHash('sha256').update(input).digest('hex');
  }

  private async createEvent(type: string, entityType: string, entityId: string, payload: object): Promise<ChainTxResult> {
    const txHash = this.createHash(`${type}:${entityType}:${entityId}:${Date.now()}:${randomUUID()}`);
    await this.prisma.chainEvent.create({
      data: {
        type,
        entityType,
        entityId,
        txHash,
        payload
      }
    });
    return { txHash, chainEntityId: entityId };
  }

  async mintGreenCoins(input: { userId: string; amount: number; reason: string }): Promise<ChainTxResult> {
    return this.createEvent('MINT_GREEN_COINS', 'User', input.userId, input);
  }

  async mintImpactCertificate(input: { certificateId: string; buyerCompanyId: string; reportHash: string; evidenceHash: string; }): Promise<ChainTxResult> {
    await this.prisma.chainEvent.create({
      data: {
        type: 'MINT_IMPACT_CERTIFICATE',
        entityType: 'Certificate',
        entityId: input.certificateId,
        txHash: this.createHash(`MINT_IMPACT_CERTIFICATE:${input.certificateId}`),
        payload: input
      }
    });
    await this.prisma.certificate.update({
      where: { id: input.certificateId },
      data: {
        chainCertificateId: input.certificateId,
        chainMintTxHash: this.createHash(`MINT_IMPACT_CERTIFICATE:${input.certificateId}`)
      }
    });
    return { txHash: this.createHash(`MINT_IMPACT_CERTIFICATE:${input.certificateId}`), chainEntityId: input.certificateId };
  }

  async transferCertificate(input: { certificateId: string; toWallet: string }): Promise<ChainTxResult> {
    return this.createEvent('TRANSFER_CERTIFICATE', 'Certificate', input.certificateId, input);
  }

  async retireCertificate(input: { certificateId: string }): Promise<ChainTxResult> {
    const txHash = this.createHash(`RETIRE_CERTIFICATE:${input.certificateId}`);
    await this.prisma.chainEvent.create({
      data: {
        type: 'RETIRE_CERTIFICATE',
        entityType: 'Certificate',
        entityId: input.certificateId,
        txHash,
        payload: input
      }
    });
    await this.prisma.certificate.update({
      where: { id: input.certificateId },
      data: { chainRetireTxHash: txHash }
    });
    return { txHash, chainEntityId: input.certificateId };
  }

  async getCertificateStatus(certificateId: string): Promise<ChainCertificateStatus | null> {
    const certificate = await this.prisma.certificate.findUnique({ where: { id: certificateId } });
    if (!certificate) return null;
    return {
      certificateId,
      owner: certificate.buyerCompanyId ?? 'unassigned',
      retired: certificate.status === 'RETIRED',
      reportHash: certificate.reportHash,
      evidenceHash: certificate.evidenceBundleHash
    };
  }
}
