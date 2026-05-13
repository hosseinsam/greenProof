import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { SpeciesService } from './species.service';

@ApiTags('Species')
@Controller()
export class SpeciesController {
  constructor(private speciesService: SpeciesService) {}

  @ApiOperation({ summary: 'List public species options' })
  @Get('species')
  async list() {
    return { status: 'success', data: { species: await this.speciesService.findMany() } };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a species' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post('admin/species')
  async create(@Body() body: CreateSpeciesDto) {
    return { status: 'success', data: { species: await this.speciesService.create(body) } };
  }
}
