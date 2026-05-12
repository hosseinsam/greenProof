import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const ledger = await this.prisma.greenCoinLedger.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    const balance = ledger.reduce((sum, entry) => sum + entry.amount, 0);
    return { balance, ledger };
  }
}
