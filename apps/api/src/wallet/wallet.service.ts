import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const ledger = await this.prisma.greenCoinLedger.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    const balance = ledger.reduce((sum, entry) => sum + entry.amount, 0);
    const stats = await this.getPublicStats(userId);
    return { balance, ledger, stats };
  }

  async getPublicStats(userId: string) {
    const [ledger, approvedSubmissions] = await Promise.all([
      this.prisma.greenCoinLedger.findMany({ where: { userId } }),
      this.prisma.submission.findMany({
        where: { userId, status: 'APPROVED' },
        include: { impactUnit: true }
      })
    ]);

    return {
      totalCoinsEarned: ledger.reduce((sum, entry) => sum + Math.max(entry.amount, 0), 0),
      verifiedTrees: approvedSubmissions.filter(submission => submission.type === 'TREE_PLANTED').length,
      verifiedMaintenance: approvedSubmissions.filter(submission => submission.type === 'MAINTENANCE' || submission.type === 'SURVIVAL_CHECK').length,
      projectsHelped: new Set(approvedSubmissions.map(submission => submission.projectId).filter(Boolean)).size,
      approvedSubmissions: approvedSubmissions.length
    };
  }
}
