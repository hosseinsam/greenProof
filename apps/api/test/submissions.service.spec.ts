import { describe, expect, it, vi } from 'vitest';
import { SubmissionsService } from '../src/submissions/submissions.service';
import { AuditService } from '../src/audit/audit.service';
import { SubmissionStatus, SubmissionType } from '@prisma/client';

const prismaMock = {
  submission: { findUnique: vi.fn(), update: vi.fn(), findFirst: vi.fn(), create: vi.fn() },
  greenCoinLedger: { create: vi.fn(), update: vi.fn() },
  impactUnit: { create: vi.fn() }
};
const chainMock = { mintGreenCoins: vi.fn(() => Promise.resolve({ txHash: 'tx123', chainEntityId: 'u1' })) };
const auditMock = { record: vi.fn() };

describe('SubmissionsService', () => {
  it('approves submission and mints coins', async () => {
    prismaMock.submission.findUnique.mockResolvedValueOnce({ id: 'sub1', userId: 'u1', type: SubmissionType.TREE_PLANTED, projectId: 'p1', status: SubmissionStatus.PENDING });
    prismaMock.submission.update.mockResolvedValueOnce({ id: 'sub1', userId: 'u1', type: SubmissionType.TREE_PLANTED, projectId: 'p1', status: SubmissionStatus.APPROVED });
    prismaMock.greenCoinLedger.create.mockResolvedValueOnce({ id: 'ledger1' });
    prismaMock.greenCoinLedger.update.mockResolvedValueOnce({ id: 'ledger1' });
    prismaMock.impactUnit.create.mockResolvedValueOnce({ id: 'unit1' });

    const service = new SubmissionsService(prismaMock as any, chainMock as any, auditMock as any);
    const result = await service.approve('sub1', 'admin1');
    expect(result.status).toBe('APPROVED');
    expect(chainMock.mintGreenCoins).toHaveBeenCalled();
  });
});
