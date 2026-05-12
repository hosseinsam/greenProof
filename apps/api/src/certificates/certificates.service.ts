import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChainRegistryAdapter } from '../common/interfaces/chain-registry.adapter';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService, private chainRegistry: ChainRegistryAdapter) {}

  async findPublicByCode(code: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { code },
      include: { impactPack: true, project: true, buyerCompany: true }
    });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    const status = await this.chainRegistry.getCertificateStatus(certificate.id);
    return { certificate, status };
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
}
