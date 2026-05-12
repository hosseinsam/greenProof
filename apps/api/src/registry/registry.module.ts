import { Module } from '@nestjs/common';
import { RegistryService } from './registry.service';
import { RegistryController } from './registry.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [RegistryService, PrismaService],
  controllers: [RegistryController]
})
export class RegistryModule {}
