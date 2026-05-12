import { describe, expect, it, vi } from 'vitest';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../src/auth/auth.service';
import { Role } from '@prisma/client';

const prismaMock = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn()
  }
};

const jwtMock = {
  sign: vi.fn(() => 'token')
};

describe('AuthService', () => {
  it('should validate and login a user', async () => {
    const hashed = await bcrypt.hash('password123', 10);
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: '1', email: 'user@example.com', passwordHash: hashed, role: Role.USER, name: 'User' });
    const service = new AuthService(prismaMock as any, jwtMock as any);
    const user = await service.validateUser('user@example.com', 'password123');
    expect(user).toBeTruthy();
    expect(await service.login(user)).toEqual({ accessToken: 'token', user });
  });

  it('should register a new user', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    prismaMock.user.create.mockResolvedValueOnce({ id: '2', email: 'new@example.com', passwordHash: 'hash', name: 'New', role: 'USER' });
    const service = new AuthService(prismaMock as any, jwtMock as any);
    const user = await service.register({ email: 'new@example.com', password: 'secure123', name: 'New', role: 'USER' });
    expect(user.email).toBe('new@example.com');
  });
});
