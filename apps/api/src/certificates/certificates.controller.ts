import { Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CertificatesService } from './certificates.service';

@Controller()
export class CertificatesController {
  constructor(private certificatesService: CertificatesService) {}

  @Get('certificates/:code/public')
  async public(@Param('code') code: string) {
    return { status: 'success', data: await this.certificatesService.findPublicByCode(code) };
  }

  @Get('certificates/:code/qr.svg')
  async qr(@Param('code') code: string, @Res() res: Response) {
    const svg = await this.certificatesService.getQrSvg(code);
    res.type('image/svg+xml').send(svg);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('admin/certificates')
  async adminList() {
    return { status: 'success', data: { certificates: await this.certificatesService.listAdmin() } };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post('admin/certificates/:id/retire')
  async retire(@Param('id') id: string) {
    return { status: 'success', data: { certificate: await this.certificatesService.retire(id) } };
  }

  @Get('certificates/:id/report')
  async report(@Param('id') id: string, @Res() res: Response) {
    const result = await this.certificatesService.getReport(id);
    res.type('text/html').send(result.content);
  }
}
