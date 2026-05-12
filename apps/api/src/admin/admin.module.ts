import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PrismaService],
  controllers: [AdminController]
})
export class AdminModule {}
