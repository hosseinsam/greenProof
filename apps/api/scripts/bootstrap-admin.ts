import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  const name = process.env.BOOTSTRAP_ADMIN_NAME ?? 'GreenProof Owner';

  if (!email || !password) {
    throw new Error('BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD are required');
  }
  if (password.length < 12) {
    throw new Error('BOOTSTRAP_ADMIN_PASSWORD must be at least 12 characters');
  }

  const existingAdmin = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
  if (existingAdmin) {
    throw new Error(`Admin bootstrap refused: an admin already exists (${existingAdmin.email})`);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      name,
      role: Role.ADMIN
    },
    create: {
      email,
      passwordHash,
      name,
      role: Role.ADMIN
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  });

  console.log(`Bootstrapped admin ${admin.email} (${admin.id})`);
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
