import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { SpeciesService } from './species.service';

@Controller()
export class SpeciesController {
  constructor(private speciesService: SpeciesService) {}

  @Get('species')
  async list() {
    return { status: 'success', data: { species: await this.speciesService.findMany() } };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post('admin/species')
  async create(@Body() body: CreateSpeciesDto) {
    return { status: 'success', data: { species: await this.speciesService.create(body) } };
  }
}
