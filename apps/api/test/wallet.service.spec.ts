import { describe, expect, it } from 'vitest';
import { WalletService } from '../src/wallet/wallet.service';

const prismaMock = {
  greenCoinLedger: {
    findMany: () => Promise.resolve([{ amount: 5 }, { amount: 10 }])
  }
};

describe('WalletService', () => {
  it('calculates balance and returns ledger', async () => {
    const service = new WalletService(prismaMock as any);
    const result = await service.getWallet('user-1');
    expect(result.balance).toBe(15);
    expect(result.ledger).toHaveLength(2);
  });
});
