import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuditModule } from '../audit/audit.module';
import { ChainModule } from '../chain/chain.module';

@Module({
  imports: [AuditModule, ChainModule],
  providers: [PurchasesService, PrismaService],
  controllers: [PurchasesController]
})
export class PurchasesModule {}
