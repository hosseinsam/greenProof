import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [SpeciesService, PrismaService],
  controllers: [SpeciesController],
  exports: [SpeciesService]
})
export class SpeciesModule {}
