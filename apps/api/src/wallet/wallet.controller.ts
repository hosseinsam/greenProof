import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WalletService } from './wallet.service';
import { RequestWithUser } from '../auth/types/request-with-user';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() request: RequestWithUser) {
    return { status: 'success', data: await this.walletService.getWallet(request.user.sub) };
  }

  @Get('users/:id/public-stats')
  async publicStats(@Param('id') id: string) {
    return { status: 'success', data: await this.walletService.getPublicStats(id) };
  }
}
