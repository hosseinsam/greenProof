import { Module } from '@nestjs/common';
import { ImpactPacksService } from './impact-packs.service';
import { ImpactPacksController } from './impact-packs.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ImpactPacksService, PrismaService],
  controllers: [ImpactPacksController],
  exports: [ImpactPacksService]
})
export class ImpactPacksModule {}
