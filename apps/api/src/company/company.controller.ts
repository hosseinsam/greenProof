import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequestWithUser } from '../auth/types/request-with-user';
import { PrismaService } from '../prisma/prisma.service';

@Controller('company')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('COMPANY')
export class CompanyController {
  constructor(private prisma: PrismaService) {}

  @Get('dashboard')
  async dashboard(@Req() request: RequestWithUser) {
    const certificates = await this.prisma.certificate.findMany({
      where: { buyerCompanyId: request.user.sub },
      include: { impactPack: true }
    });
    const purchases = await this.prisma.purchase.findMany({ where: { companyId: request.user.sub } });
    const totalTrees = certificates.reduce((sum, cert) => sum + (cert.impactPack?.treesPlanted ?? 0), 0);
    const amountSpent = purchases.reduce((sum, purchase) => sum + purchase.amountCents, 0) / 100;
    const retired = certificates.filter(cert => cert.status === 'RETIRED').length;
    return {
      status: 'success',
      data: {
        purchasedCertificates: certificates.length,
        retiredCertificates: retired,
        totalTreesFunded: totalTrees,
        totalAmountSpent: amountSpent,
        claimSafeText: 'This purchased certificate documents verified local nature-impact support and is intended for transparent sustainability reporting.'
      }
    };
  }
}
