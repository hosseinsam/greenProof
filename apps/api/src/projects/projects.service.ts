import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findMany() {
    return this.prisma.project.findMany({ include: { impactPacks: true } });
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({ where: { id }, include: { impactPacks: true } });
  }

  async create(data: CreateProjectDto) {
    return this.prisma.project.create({ data });
  }

  async update(id: string, data: UpdateProjectDto) {
    return this.prisma.project.update({ where: { id }, data });
  }
}
