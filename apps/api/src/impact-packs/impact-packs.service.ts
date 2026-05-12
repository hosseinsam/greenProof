import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImpactPackDto } from './dto/create-impact-pack.dto';
import { UpdateImpactPackDto } from './dto/update-impact-pack.dto';

@Injectable()
export class ImpactPacksService {
  constructor(private prisma: PrismaService) {}

  async findMany() {
    return this.prisma.impactPack.findMany({ where: { status: { not: 'ARCHIVED' } }, include: { project: true } });
  }

  async findOne(id: string) {
    return this.prisma.impactPack.findUnique({ where: { id }, include: { project: true } });
  }

  async create(data: CreateImpactPackDto) {
    return this.prisma.impactPack.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        description: data.description,
        priceCents: data.priceCents,
        treesPlanted: data.treesPlanted,
        treesAlive12m: data.treesAlive12m,
        seedsPlanted: data.seedsPlanted,
        impactUnitsRequired: data.impactUnitsRequired,
        status: data.status ?? 'AVAILABLE'
      }
    });
  }

  async update(id: string, data: UpdateImpactPackDto) {
    return this.prisma.impactPack.update({ where: { id }, data });
  }
}
