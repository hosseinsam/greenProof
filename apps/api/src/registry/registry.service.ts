import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegistryService {
  constructor(private prisma: PrismaService) {}

  async getCertificateByCode(code: string) {
    const certificate = await this.prisma.certificate.findUnique({ where: { code } });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    return certificate;
  }

  async getEventsByEntity(entityId: string) {
    return this.prisma.chainEvent.findMany({ where: { entityId }, orderBy: { createdAt: 'desc' } });
  }
}
