import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpeciesDto } from './dto/create-species.dto';

@Injectable()
export class SpeciesService {
  constructor(private prisma: PrismaService) {}

  async findMany() {
    return this.prisma.species.findMany();
  }

  async create(data: CreateSpeciesDto) {
    return this.prisma.species.create({ data });
  }
}
