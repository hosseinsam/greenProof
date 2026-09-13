import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';
import { ChainRegistryAdapter } from '../common/interfaces/chain-registry.adapter';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { assertLaunchSafePaymentMode } from '../config/environment';
import { writePrivateFile } from '../common/storage/safe-storage';

@Injectable()
export class PurchasesService {
  constructor(
    private prisma: PrismaService,
    private chainRegistry: ChainRegistryAdapter,
    private auditService: AuditService,
    private config?: ConfigService
  ) {}

  private simpleCode() {
    return `GRP-${randomBytes(4).toString('hex').toUpperCase()}`;
  }

  async buyCompanyPack(companyId: string, impactPackId: string) {
    const paymentMode = this.config?.get<string>('PAYMENT_MODE') ?? 'simulated';
    assertLaunchSafePaymentMode(paymentMode);

    const { pack, purchase, certificate, reportHash, evidenceBundleHash } = await this.prisma.$transaction(async tx => {
      const impactPack = await tx.impactPack.findUnique({ where: { id: impactPackId }, include: { project: true } });
      if (!impactPack || impactPack.status !== 'AVAILABLE') {
        throw new BadRequestException('Impact pack is not available');
      }

      const availableUnits = await tx.impactUnit.findMany({
        where: { projectId: impactPack.projectId, locked: false },
        take: impactPack.impactUnitsRequired,
        orderBy: { createdAt: 'asc' }
      });
      if (availableUnits.length < impactPack.impactUnitsRequired) {
        throw new BadRequestException('Not enough available impact units for this project');
      }

      const newPurchase = await tx.purchase.create({
        data: {
          companyId,
          impactPackId: impactPack.id,
          amountCents: impactPack.priceCents,
          currency: impactPack.currency,
          status: paymentMode === 'manual' ? 'PENDING' : 'PAID'
        }
      });

      const certificateCode = this.simpleCode();
      const reportHash = createHash('sha256').update(`${certificateCode}:${Date.now()}`).digest('hex');
      const evidenceBundleHash = createHash('sha256').update(`${impactPack.name}:${newPurchase.id}`).digest('hex');

      const newCertificate = await tx.certificate.create({
        data: {
          code: certificateCode,
          impactPackId: impactPack.id,
          projectId: impactPack.projectId,
          buyerCompanyId: companyId,
          status: 'ISSUED',
          verificationLevel: impactPack.project.verificationLevel,
          reportHash,
          evidenceBundleHash
        }
      });

      const selectedIds = availableUnits.map(unit => unit.id);
      const locked = await tx.impactUnit.updateMany({
        where: { id: { in: selectedIds }, locked: false },
        data: { locked: true, certificateId: newCertificate.id }
      });
      if (locked.count !== impactPack.impactUnitsRequired) {
        throw new BadRequestException('Impact units were reserved by another purchase');
      }

      return { pack: impactPack, purchase: newPurchase, certificate: newCertificate, reportHash, evidenceBundleHash };
    });

    if (paymentMode === 'manual') {
      await this.auditService.record(companyId, 'create_manual_payment_purchase', 'Purchase', purchase.id, {
        impactPackId: pack.id,
        certificateId: certificate.id
      });
      return { purchase, certificate, requiresManualPaymentConfirmation: true };
    }

    const retired = await this.finalizePaidPurchase(purchase.id, certificate.id, companyId, reportHash, evidenceBundleHash);

    await this.auditService.record(companyId, 'purchase_impact_pack', 'Purchase', purchase.id, {
      impactPackId: pack.id,
      certificateId: retired.id,
      paymentMode
    });

    return { purchase: await this.prisma.purchase.findUnique({ where: { id: purchase.id }, include: { certificate: true } }), certificate: retired };
  }

  async confirmManualPayment(purchaseId: string, adminId: string, paymentReference: string) {
    const purchase = await this.prisma.purchase.findUnique({ where: { id: purchaseId }, include: { certificate: true } });
    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }
    if (purchase.status !== 'PENDING' || !purchase.certificateId) {
      throw new BadRequestException('Purchase is not waiting for manual payment confirmation');
    }

    const certificate = await this.prisma.certificate.findUnique({ where: { id: purchase.certificateId } });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    await this.prisma.purchase.update({
      where: { id: purchase.id },
      data: { status: 'PAID', paymentReference, paidAt: new Date() }
    });

    const retired = await this.finalizePaidPurchase(
      purchase.id,
      certificate.id,
      purchase.companyId,
      certificate.reportHash,
      certificate.evidenceBundleHash
    );

    await this.auditService.record(adminId, 'confirm_manual_payment', 'Purchase', purchase.id, {
      paymentReference,
      certificateId: retired.id
    });

    return { purchase: await this.prisma.purchase.findUnique({ where: { id: purchase.id }, include: { certificate: true } }), certificate: retired };
  }

  private async finalizePaidPurchase(purchaseId: string, certificateId: string, companyId: string, reportHash: string, evidenceBundleHash: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { impactPack: { include: { project: true } } }
    });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    if (certificate.status === 'RETIRED') {
      return certificate;
    }

    const mintResult = await this.chainRegistry.mintImpactCertificate({
      certificateId,
      buyerCompanyId: companyId,
      reportHash,
      evidenceHash: evidenceBundleHash
    });

    const transferResult = await this.chainRegistry.transferCertificate({
      certificateId,
      toWallet: `company:${companyId}`
    });

    const retireResult = await this.chainRegistry.retireCertificate({ certificateId });

    const retired = await this.prisma.certificate.update({
      where: { id: certificateId },
      data: {
        status: 'RETIRED',
        chainCertificateId: certificateId,
        chainMintTxHash: mintResult.txHash,
        chainTransferTxHash: transferResult.txHash,
        chainRetireTxHash: retireResult.txHash,
        retiredAt: new Date(),
        proofTimeline: [
          { label: 'Certificate issued', at: certificate.issuedAt.toISOString() },
          { label: 'Payment confirmed', at: new Date().toISOString() },
          { label: 'Registry mint recorded', txHash: mintResult.txHash },
          { label: 'Certificate transferred', txHash: transferResult.txHash },
          { label: 'Certificate retired', txHash: retireResult.txHash }
        ]
      }
    });

    await this.prisma.purchase.update({
      where: { id: purchaseId },
      data: { certificateId: retired.id, status: 'PAID', paidAt: new Date() }
    });

    const reportHtml = this.generateReport(retired, certificate.impactPack, transferResult.txHash);
    const storageRoot = this.config?.get<string>('STORAGE_DIR') ?? './storage';
    const reportPath = await writePrivateFile(storageRoot, 'reports', `${retired.code}.html`, reportHtml);
    const fileHash = createHash('sha256').update(reportHtml).digest('hex');
    await this.prisma.reportingFile.upsert({
      where: { certificateId: retired.id },
      update: { filePath: reportPath, fileHash },
      create: { certificateId: retired.id, filePath: reportPath, fileHash }
    });

    return retired;
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

  private escapeHtml(value: unknown) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private generateReport(certificate: any, pack: any, transferTx: string) {
    const projectName = this.escapeHtml(pack.project.name);
    const packName = this.escapeHtml(pack.name);
    const code = this.escapeHtml(certificate.code);
    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>GreenProof Certificate ${code}</title></head>
<body style="font-family: system-ui, sans-serif; line-height:1.6; padding:24px;">
  <h1>GreenProof Certificate ${code}</h1>
  <p><strong>Buyer:</strong> ${this.escapeHtml(certificate.buyerCompanyId)}</p>
  <p><strong>Project:</strong> ${projectName}</p>
  <p><strong>Pack:</strong> ${packName}</p>
  <p><strong>Impact:</strong> ${this.escapeHtml(pack.treesPlanted)} verified trees, ${this.escapeHtml(pack.seedsPlanted ?? 0)} seeds</p>
  <p><strong>Verification:</strong> ${this.escapeHtml(certificate.verificationLevel)}</p>
  <p><strong>Status:</strong> ${this.escapeHtml(certificate.status)}</p>
  <p><strong>Issued:</strong> ${this.escapeHtml(certificate.issuedAt.toISOString())}</p>
  <p><strong>Retired:</strong> ${this.escapeHtml(certificate.retiredAt?.toISOString())}</p>
  <h2>Registry</h2>
  <p><strong>Mint Tx:</strong> ${this.escapeHtml(certificate.chainMintTxHash)}</p>
  <p><strong>Transfer Tx:</strong> ${this.escapeHtml(transferTx)}</p>
  <p><strong>Retire Tx:</strong> ${this.escapeHtml(certificate.chainRetireTxHash)}</p>
  <h2>Safe claims</h2>
  <p>This certificate represents verified nature impact for local sustainable reporting. It is designed for transparent evidence and community reporting, not carbon-neutral claims.</p>
  <h2>Claims to avoid</h2>
  <p>Do not claim carbon neutrality or offset status without independent certified accounting.</p>
  <h2>Hashes</h2>
  <p><strong>Report hash:</strong> ${this.escapeHtml(certificate.reportHash)}</p>
  <p><strong>Evidence bundle hash:</strong> ${this.escapeHtml(certificate.evidenceBundleHash)}</p>
  <footer style="margin-top:24px; font-size:0.9rem; color:#555;">This certificate documents verified nature-impact activity. It is not a certified carbon credit and should not be used to claim carbon neutrality unless paired with certified carbon accounting and independent verification.</footer>
</body>
</html>`;
  }
}
