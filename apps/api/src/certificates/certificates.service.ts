import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { ChainRegistryAdapter } from '../common/interfaces/chain-registry.adapter';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService, private chainRegistry: ChainRegistryAdapter, private config: ConfigService) {}

  async findPublicByCode(code: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { code },
      include: { impactPack: true, project: true, buyerCompany: true, reportingFile: true }
    });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    const status = await this.chainRegistry.getCertificateStatus(certificate.id);
    const events = await this.prisma.chainEvent.findMany({ where: { entityId: certificate.id }, orderBy: { createdAt: 'asc' } });
    return {
      certificate,
      status,
      events,
      proofTimeline: certificate.proofTimeline ?? this.fallbackTimeline(certificate),
      qrUrl: `/certificates/${certificate.code}/qr.svg`,
      reportUrl: certificate.reportingFile ? `/certificates/${certificate.id}/report` : null,
      safeClaims: [
        'Verified local nature-impact support',
        'Not a carbon-neutrality claim',
        'Not a certified offset'
      ]
    };
  }

  async getQrSvg(code: string) {
    const certificate = await this.prisma.certificate.findUnique({ where: { code } });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    const baseUrl = this.config.get<string>('PUBLIC_CERTIFICATE_BASE_URL') ?? 'http://localhost:3000/certificates';
    return QRCode.toString(`${baseUrl}/${certificate.code}`, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 2
    });
  }

  async getReport(id: string) {
    const file = await this.prisma.reportingFile.findFirst({ where: { certificateId: id } });
    if (!file) {
      throw new NotFoundException('Certificate report not found');
    }
    const content = await import('fs/promises').then(fs => fs.readFile(file.filePath, 'utf-8'));
    return { content, filePath: file.filePath };
  }

  async listAdmin() {
    return this.prisma.certificate.findMany({ include: { impactPack: true, project: true, buyerCompany: true } });
  }

  async retire(id: string) {
    const certificate = await this.prisma.certificate.update({
      where: { id },
      data: { status: 'RETIRED', retiredAt: new Date() }
    });
    const chainResult = await this.chainRegistry.retireCertificate({ certificateId: id });
    await this.prisma.certificate.update({ where: { id }, data: { chainRetireTxHash: chainResult.txHash } });
    return certificate;
  }

  private fallbackTimeline(certificate: { issuedAt: Date; retiredAt?: Date | null; chainMintTxHash?: string | null; chainTransferTxHash?: string | null; chainRetireTxHash?: string | null }) {
    return [
      { label: 'Certificate issued', at: certificate.issuedAt.toISOString() },
      certificate.chainMintTxHash ? { label: 'Registry mint recorded', txHash: certificate.chainMintTxHash } : null,
      certificate.chainTransferTxHash ? { label: 'Certificate transferred', txHash: certificate.chainTransferTxHash } : null,
      certificate.chainRetireTxHash ? { label: 'Certificate retired', at: certificate.retiredAt?.toISOString(), txHash: certificate.chainRetireTxHash } : null
    ].filter(Boolean);
  }
}
