import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async login(user: { id: string; email: string; role: Role; name: string; companyName?: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user
    };
  }

  async register(input: { email: string; password: string; name: string; role: Role; companyName?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }
    if (![Role.USER, Role.COMPANY].includes(input.role)) {
      throw new UnauthorizedException('Public registration supports USER or COMPANY roles only');
    }
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name,
        role: input.role,
        companyName: input.companyName
      }
    });
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }
}
