import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateImpactPackDto } from './dto/create-impact-pack.dto';
import { UpdateImpactPackDto } from './dto/update-impact-pack.dto';
import { ImpactPacksService } from './impact-packs.service';

@Controller()
export class ImpactPacksController {
  constructor(private impactPacksService: ImpactPacksService) {}

  @Get('impact-packs')
  async list() {
    return { status: 'success', data: { packs: await this.impactPacksService.findMany() } };
  }

  @Get('impact-packs/:id')
  async detail(@Param('id') id: string) {
    return { status: 'success', data: { pack: await this.impactPacksService.findOne(id) } };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post('admin/impact-packs')
  async create(@Body() body: CreateImpactPackDto) {
    return { status: 'success', data: { pack: await this.impactPacksService.create(body) } };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch('admin/impact-packs/:id')
  async update(@Param('id') id: string, @Body() body: UpdateImpactPackDto) {
    return { status: 'success', data: { pack: await this.impactPacksService.update(id, body) } };
  }
}
