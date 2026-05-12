import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('dashboard')
  async dashboard() {
    const pendingSubmissions = await this.prisma.submission.count({ where: { status: 'PENDING' } });
    const approvedSubmissions = await this.prisma.submission.count({ where: { status: 'APPROVED' } });
    const totalUsers = await this.prisma.user.count({ where: { role: 'USER' } });
    const totalCompanies = await this.prisma.user.count({ where: { role: 'COMPANY' } });
    const totalCoins = await this.prisma.greenCoinLedger.aggregate({ _sum: { amount: true } });
    const certificatesRetired = await this.prisma.certificate.count({ where: { status: 'RETIRED' } });
    const revenue = await this.prisma.purchase.aggregate({ _sum: { amountCents: true } });
    return {
      status: 'success',
      data: {
        pendingSubmissions,
        approvedSubmissions,
        totalUsers,
        totalCompanies,
        totalCoinsIssued: totalCoins._sum.amount ?? 0,
        certificatesRetired,
        revenueSimulated: (revenue._sum.amountCents ?? 0) / 100
      }
    };
  }
}
