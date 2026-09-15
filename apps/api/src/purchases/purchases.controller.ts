import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { PurchasesService } from './purchases.service';
import { RequestWithUser } from '../auth/types/request-with-user';
import { SimpleRateLimitGuard } from '../common/guards/simple-rate-limit.guard';

@Controller()
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard, SimpleRateLimitGuard)
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('admin/purchases/pending')
  async pendingPayments() {
    return { status: 'success', data: { purchases: await this.purchasesService.findPendingManualPayments() } };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post('admin/purchases/:id/confirm-payment')
  async confirmPayment(@Param('id') id: string, @Req() request: RequestWithUser, @Body() body: ConfirmPaymentDto) {
    return { status: 'success', data: await this.purchasesService.confirmManualPayment(id, request.user.sub, body.paymentReference) };
  }
}
