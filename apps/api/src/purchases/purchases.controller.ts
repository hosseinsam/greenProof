import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchasesService } from './purchases.service';
import { RequestWithUser } from '../auth/types/request-with-user';

@Controller()
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('COMPANY')
  @Post('company/purchases')
  async buy(@Req() request: RequestWithUser, @Body() body: CreatePurchaseDto) {
    return { status: 'success', data: await this.purchasesService.buyCompanyPack(request.user.sub, body.impactPackId) };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('COMPANY')
  @Get('company/purchases')
  async list(@Req() request: RequestWithUser) {
    return { status: 'success', data: { purchases: await this.purchasesService.findCompanyPurchases(request.user.sub) } };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('COMPANY')
  @Get('company/certificates')
  async certificates(@Req() request: RequestWithUser) {
    return { status: 'success', data: { certificates: await this.purchasesService.findCompanyCertificates(request.user.sub) } };
  }
}
