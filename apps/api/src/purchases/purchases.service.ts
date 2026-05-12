import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { ChainRegistryAdapter } from '../common/interfaces/chain-registry.adapter';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchasesService {
  constructor(
    private prisma: PrismaService,
    private chainRegistry: ChainRegistryAdapter,
    private auditService: AuditService
  ) {}

  private simpleCode() {
    return `GRP-${randomBytes(4).toString('hex').toUpperCase()}`;
  }

  async buyCompanyPack(companyId: string, impactPackId: string) {
    const pack = await this.prisma.impactPack.findUnique({ where: { id: impactPackId }, include: { project: true } });
    if (!pack || pack.status !== 'AVAILABLE') {
      throw new BadRequestException('Impact pack is not available');
    }
    const availableUnits = await this.prisma.impactUnit.findMany({
      where: { projectId: pack.projectId, locked: false }
    });
    if (availableUnits.length < pack.impactUnitsRequired) {
      throw new BadRequestException('Not enough available impact units for this project');
    }

    const purchase = await this.prisma.purchase.create({
      data: {
        companyId,
        impactPackId: pack.id,
        amountCents: pack.priceCents,
        currency: pack.currency,
        status: 'PAID'
      }
    });

    const certificateCode = this.simpleCode();
    const reportHash = createHash('sha256').update(`${certificateCode}:${Date.now()}`).digest('hex');
    const evidenceBundleHash = createHash('sha256').update(`${pack.name}:${purchase.id}`).digest('hex');

    const certificate = await this.prisma.certificate.create({
      data: {
        code: certificateCode,
        impactPackId: pack.id,
        projectId: pack.projectId,
        buyerCompanyId: companyId,
        status: 'ISSUED',
        verificationLevel: pack.project.verificationLevel,
        reportHash,
        evidenceBundleHash
      }
    });

    const selectedUnits = availableUnits.slice(0, pack.impactUnitsRequired);
    await this.prisma.impactUnit.updateMany({
      where: { id: { in: selectedUnits.map(unit => unit.id) } },
      data: { locked: true, certificateId: certificate.id }
    });

    const mintResult = await this.chainRegistry.mintImpactCertificate({
      certificateId: certificate.id,
      buyerCompanyId: companyId,
      reportHash,
      evidenceHash: evidenceBundleHash
    });

    const transferResult = await this.chainRegistry.transferCertificate({
      certificateId: certificate.id,
      toWallet: `company:${companyId}`
    });

    const retireResult = await this.chainRegistry.retireCertificate({ certificateId: certificate.id });

    const retired = await this.prisma.certificate.update({
      where: { id: certificate.id },
      data: {
        status: 'RETIRED',
        chainCertificateId: certificate.id,
        chainMintTxHash: mintResult.txHash,
        chainRetireTxHash: retireResult.txHash,
        retiredAt: new Date()
      }
    });

    await this.prisma.purchase.update({ where: { id: purchase.id }, data: { certificateId: retired.id } });

    const reportHtml = this.generateReport(retired, pack, transferResult.txHash);
    const reportPath = `storage/reports/${retired.code}.html`;
    await import('fs/promises').then(fs => fs.mkdir('storage/reports', { recursive: true }));
    await import('fs/promises').then(fs => fs.writeFile(reportPath, reportHtml));
    const fileHash = createHash('sha256').update(reportHtml).digest('hex');
    await this.prisma.reportingFile.create({ data: { certificateId: retired.id, filePath: reportPath, fileHash } });

    await this.auditService.record(companyId, 'purchase_impact_pack', 'Purchase', purchase.id, {
      impactPackId: pack.id,
      certificateId: retired.id
    });

    return { purchase, certificate: retired };
  }

  async findCompanyPurchases(companyId: string) {
    return this.prisma.purchase.findMany({
      where: { companyId },
      include: { impactPack: true, certificate: true }
    });
  }

  async findCompanyCertificates(companyId: string) {
    return this.prisma.certificate.findMany({
      where: { buyerCompanyId: companyId },
      include: { impactPack: true, project: true }
    });
  }

  private generateReport(certificate: any, pack: any, transferTx: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>GreenProof Certificate ${certificate.code}</title></head>
<body style="font-family: system-ui, sans-serif; line-height:1.6; padding:24px;">
  <h1>GreenProof Certificate ${certificate.code}</h1>
  <p><strong>Buyer:</strong> ${certificate.buyerCompanyId}</p>
  <p><strong>Project:</strong> ${pack.project.name}</p>
  <p><strong>Pack:</strong> ${pack.name}</p>
  <p><strong>Impact:</strong> ${pack.treesPlanted} verified trees, ${pack.seedsPlanted ?? 0} seeds</p>
  <p><strong>Verification:</strong> ${certificate.verificationLevel}</p>
  <p><strong>Status:</strong> ${certificate.status}</p>
  <p><strong>Issued:</strong> ${certificate.issuedAt.toISOString()}</p>
  <p><strong>Retired:</strong> ${certificate.retiredAt?.toISOString()}</p>
  <h2>Registry</h2>
  <p><strong>Mint Tx:</strong> ${certificate.chainMintTxHash}</p>
  <p><strong>Transfer Tx:</strong> ${transferTx}</p>
  <p><strong>Retire Tx:</strong> ${certificate.chainRetireTxHash}</p>
  <h2>Safe claims</h2>
  <p>This certificate represents verified nature impact for local sustainable reporting. It is designed for transparent evidence and community reporting, not carbon-neutral claims.</p>
  <h2>Claims to avoid</h2>
  <p>Do not claim carbon neutrality or offset status without independent certified accounting.</p>
  <h2>Hashes</h2>
  <p><strong>Report hash:</strong> ${certificate.reportHash}</p>
  <p><strong>Evidence bundle hash:</strong> ${certificate.evidenceBundleHash}</p>
  <footer style="margin-top:24px; font-size:0.9rem; color:#555;">This certificate documents verified nature-impact activity. It is not a certified carbon credit and should not be used to claim carbon neutrality unless paired with certified carbon accounting and independent verification.</footer>
</body>
</html>`;
  }
}
