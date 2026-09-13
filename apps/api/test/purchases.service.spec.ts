import { describe, expect, it, vi } from 'vitest';
import { PurchasesService } from '../src/purchases/purchases.service';
import { ImpactPackStatus, CertificateStatus, VerificationLevel } from '@prisma/client';

const prismaMock = {
  $transaction: vi.fn((callback) => callback(prismaMock)),
  purchase: { create: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
  certificate: { create: vi.fn(), update: vi.fn(), findUnique: vi.fn() },
  project: { findUnique: vi.fn() },
  impactPack: { findUnique: vi.fn() },
  impactUnit: { findMany: vi.fn(), updateMany: vi.fn() },
  reportingFile: { create: vi.fn(), upsert: vi.fn() }
};
const chainMock = {
  mintImpactCertificate: vi.fn(() => Promise.resolve({ txHash: 'tx-mint' })),
  transferCertificate: vi.fn(() => Promise.resolve({ txHash: 'tx-transfer' })),
  retireCertificate: vi.fn(() => Promise.resolve({ txHash: 'tx-retire' }))
};
const auditMock = { record: vi.fn() };

const fakePack = {
  id: 'pack1',
  name: 'Renewable Energy Credits',
  priceCents: 5000,
  currency: 'USD',
  status: ImpactPackStatus.AVAILABLE,
  impactUnitsRequired: 1,
  projectId: 'proj1',
  project: { id: 'proj1', name: 'Solar Park', verificationLevel: VerificationLevel.BASIC },
  treesPlanted: 100,
  seedsPlanted: 0
};

describe('PurchasesService', () => {
  it('creates purchase and certificate', async () => {
    prismaMock.impactPack.findUnique.mockResolvedValueOnce(fakePack);
    prismaMock.impactUnit.findMany.mockResolvedValueOnce([{ id: 'unit1' }]);
    prismaMock.purchase.create.mockResolvedValueOnce({ id: 'purchase1' });
    prismaMock.certificate.create.mockResolvedValueOnce({ id: 'cert1', code: 'GRP-1234', buyerCompanyId: 'c1', status: CertificateStatus.ISSUED, verificationLevel: VerificationLevel.BASIC, reportHash: 'hash', evidenceBundleHash: 'evidence', chainMintTxHash: null, chainRetireTxHash: null, issuedAt: new Date(), retiredAt: null });
    prismaMock.certificate.findUnique.mockResolvedValueOnce({ id: 'cert1', code: 'GRP-1234', buyerCompanyId: 'c1', status: CertificateStatus.ISSUED, verificationLevel: VerificationLevel.BASIC, reportHash: 'hash', evidenceBundleHash: 'evidence', chainMintTxHash: null, chainRetireTxHash: null, issuedAt: new Date(), retiredAt: null, impactPack: fakePack });
    prismaMock.certificate.update.mockResolvedValueOnce({ id: 'cert1', status: CertificateStatus.RETIRED, code: 'GRP-1234', buyerCompanyId: 'c1', verificationLevel: VerificationLevel.BASIC, reportHash: 'hash', evidenceBundleHash: 'evidence', chainMintTxHash: 'tx-mint', chainRetireTxHash: 'tx-retire', issuedAt: new Date(), retiredAt: new Date() });
    prismaMock.impactUnit.updateMany.mockResolvedValueOnce({ count: 1 });
    prismaMock.purchase.update.mockResolvedValueOnce({ id: 'purchase1' });
    prismaMock.purchase.findUnique.mockResolvedValueOnce({ id: 'purchase1' });
    prismaMock.reportingFile.upsert.mockResolvedValueOnce({ id: 'file1' });

    const service = new PurchasesService(prismaMock as any, chainMock as any, auditMock as any);
    const result = await service.buyCompanyPack('c1', 'pack1');

    expect(result.certificate.status).toBe(CertificateStatus.RETIRED);
    expect(chainMock.transferCertificate).toHaveBeenCalled();
    expect(chainMock.retireCertificate).toHaveBeenCalled();
    expect(auditMock.record).toHaveBeenCalledWith('c1', 'purchase_impact_pack', 'Purchase', 'purchase1', expect.any(Object));
  });
});
