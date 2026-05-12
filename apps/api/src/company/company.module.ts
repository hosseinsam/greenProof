import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PrismaService],
  controllers: [CompanyController]
})
export class CompanyModule {}
