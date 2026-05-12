import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ChainModule } from '../chain/chain.module';

@Module({
  imports: [ChainModule],
  providers: [CertificatesService, PrismaService],
  controllers: [CertificatesController]
})
export class CertificatesModule {}
