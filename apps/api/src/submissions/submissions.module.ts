import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuditModule } from '../audit/audit.module';
import { ChainModule } from '../chain/chain.module';

@Module({
  imports: [AuditModule, ChainModule],
  providers: [SubmissionsService, PrismaService],
  controllers: [SubmissionsController]
})
export class SubmissionsModule {}
