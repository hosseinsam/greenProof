import { Controller, Get, Param } from '@nestjs/common';
import { RegistryService } from './registry.service';

@Controller('registry')
export class RegistryController {
  constructor(private registryService: RegistryService) {}

  @Get('certificates/:code')
  async certificate(@Param('code') code: string) {
    return { status: 'success', data: { certificate: await this.registryService.getCertificateByCode(code) } };
  }

  @Get('events/:entityId')
  async events(@Param('entityId') entityId: string) {
    return { status: 'success', data: { events: await this.registryService.getEventsByEntity(entityId) } };
  }
}
