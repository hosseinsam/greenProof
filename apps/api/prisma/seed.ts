import { PrismaClient, Role, ProjectStatus, VerificationLevel, ImpactPackStatus, SubmissionStatus, SubmissionType, PaymentStatus, CertificateStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123456', 10);
  const userPassword = await bcrypt.hash('user123456', 10);
  const companyPassword = await bcrypt.hash('company123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@greenproof.local' },
    update: { passwordHash: adminPassword, name: 'GreenProof Admin', role: Role.ADMIN },
    create: { email: 'admin@greenproof.local', passwordHash: adminPassword, name: 'GreenProof Admin', role: Role.ADMIN }
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@greenproof.local' },
    update: { passwordHash: userPassword, name: 'Community User', role: Role.USER },
    create: { email: 'user@greenproof.local', passwordHash: userPassword, name: 'Community User', role: Role.USER }
  });

  const company = await prisma.user.upsert({
    where: { email: 'company@greenproof.local' },
    update: { passwordHash: companyPassword, name: 'Nordic Café AB', role: Role.COMPANY, companyName: 'Nordic Café AB' },
    create: { email: 'company@greenproof.local', passwordHash: companyPassword, name: 'Nordic Café AB', role: Role.COMPANY, companyName: 'Nordic Café AB' }
  });

  const project1 = await prisma.project.upsert({
    where: { code: 'STHLM-SCHOOL' },
    update: {
      name: 'Stockholm School Tree Pilot',
      country: 'Sweden',
      city: 'Stockholm',
      description: 'Verified tree planting in a local school yard.',
      projectType: 'urban_greening',
      partnerName: 'Local School Partner',
      status: ProjectStatus.ACTIVE,
      verificationLevel: VerificationLevel.PARTNER_VERIFIED
    },
    create: {
      code: 'STHLM-SCHOOL',
      name: 'Stockholm School Tree Pilot',
      country: 'Sweden',
      city: 'Stockholm',
      description: 'Verified tree planting in a local school yard.',
      projectType: 'urban_greening',
      partnerName: 'Local School Partner',
      status: ProjectStatus.ACTIVE,
      verificationLevel: VerificationLevel.PARTNER_VERIFIED
    }
  });

  const project2 = await prisma.project.upsert({
    where: { code: 'UPPSALA-SEED' },
    update: {
      name: 'Community Seed Restoration Pilot',
      country: 'Sweden',
      city: 'Uppsala',
      description: 'Native seed restoration for local greenspace recovery.',
      projectType: 'seed_restoration',
      partnerName: 'Local NGO',
      status: ProjectStatus.ACTIVE,
      verificationLevel: VerificationLevel.BASIC
    },
    create: {
      code: 'UPPSALA-SEED',
      name: 'Community Seed Restoration Pilot',
      country: 'Sweden',
      city: 'Uppsala',
      description: 'Native seed restoration for local greenspace recovery.',
      projectType: 'seed_restoration',
      partnerName: 'Local NGO',
      status: ProjectStatus.ACTIVE,
      verificationLevel: VerificationLevel.BASIC
    }
  });

  const species = [
    { commonName: 'Birch', scientificName: 'Betula pendula', region: 'Scandinavia', native: true, invasiveRisk: false },
    { commonName: 'Oak', scientificName: 'Quercus robur', region: 'Europe', native: true, invasiveRisk: false },
    { commonName: 'Rowan', scientificName: 'Sorbus aucuparia', region: 'Northern Europe', native: true, invasiveRisk: false },
    { commonName: 'Pine', scientificName: 'Pinus sylvestris', region: 'Northern Europe', native: true, invasiveRisk: false },
    { commonName: 'Wildflower native seed mix', scientificName: null, region: 'Swedish meadows', native: true, invasiveRisk: false }
  ];
  for (const item of species) {
    await prisma.species.upsert({
      where: { commonName: item.commonName },
      update: item,
      create: item
    });
  }

  const pack1 = await prisma.impactPack.upsert({
    where: { name: 'Starter Tree Pack' },
    update: {
      projectId: project1.id,
      description: '10 verified trees supported for local school and community reporting.',
      priceCents: 7900,
      treesPlanted: 10,
      treesAlive12m: 8,
      impactUnitsRequired: 10,
      status: ImpactPackStatus.AVAILABLE
    },
    create: {
      projectId: project1.id,
      name: 'Starter Tree Pack',
      description: '10 verified trees supported for local school and community reporting.',
      priceCents: 7900,
      treesPlanted: 10,
      treesAlive12m: 8,
      impactUnitsRequired: 10,
      status: ImpactPackStatus.AVAILABLE
    }
  });

  const pack2 = await prisma.impactPack.upsert({
    where: { name: 'Local ESG Pack' },
    update: {
      projectId: project1.id,
      description: '100 verified trees with transparent registry support.',
      priceCents: 69900,
      treesPlanted: 100,
      treesAlive12m: 85,
      impactUnitsRequired: 100,
      status: ImpactPackStatus.AVAILABLE
    },
    create: {
      projectId: project1.id,
      name: 'Local ESG Pack',
      description: '100 verified trees with transparent registry support.',
      priceCents: 69900,
      treesPlanted: 100,
      treesAlive12m: 85,
      impactUnitsRequired: 100,
      status: ImpactPackStatus.AVAILABLE
    }
  });

  const pack3 = await prisma.impactPack.upsert({
    where: { name: 'Community Seed Pack' },
    update: {
      projectId: project2.id,
      description: '500 native seeds for restoration and local environmental reporting.',
      priceCents: 14900,
      treesPlanted: 0,
      seedsPlanted: 500,
      impactUnitsRequired: 10,
      status: ImpactPackStatus.AVAILABLE
    },
    create: {
      projectId: project2.id,
      name: 'Community Seed Pack',
      description: '500 native seeds for restoration and local environmental reporting.',
      priceCents: 14900,
      treesPlanted: 0,
      seedsPlanted: 500,
      impactUnitsRequired: 10,
      status: ImpactPackStatus.AVAILABLE
    }
  });

  const pending1 = await prisma.submission.upsert({
    where: { id: 'pending-submission-1' },
    update: {},
    create: {
      id: 'pending-submission-1',
      userId: user.id,
      projectId: project1.id,
      speciesId: (await prisma.species.findFirst({ where: { commonName: 'Birch' } })).id,
      type: SubmissionType.TREE_PLANTED,
      title: 'Planting birch seedlings at school yard',
      description: 'Documented planting of three birch seedlings near the school garden.',
      locationPrecision: 'city-level',
      evidenceHash: 'pending-hash-1',
      evidenceFilePath: 'storage/submissions/pending1.jpg',
      status: SubmissionStatus.PENDING
    }
  });

  const approved1 = await prisma.submission.upsert({
    where: { id: 'approved-submission-1' },
    update: {},
    create: {
      id: 'approved-submission-1',
      userId: user.id,
      projectId: project1.id,
      speciesId: (await prisma.species.findFirst({ where: { commonName: 'Oak' } })).id,
      type: SubmissionType.TREE_PLANTED,
      title: 'Oak planting verification',
      description: 'Verified oak tree planting completed and accepted.',
      locationPrecision: 'city-level',
      evidenceHash: 'approved-hash-1',
      evidenceFilePath: 'storage/submissions/approved1.jpg',
      status: SubmissionStatus.APPROVED,
      reviewedById: admin.id,
      reviewedAt: new Date()
    }
  });

  await prisma.greenCoinLedger.upsert({
    where: { id: 'ledger-1' },
    update: {},
    create: {
      id: 'ledger-1',
      userId: user.id,
      submissionId: approved1.id,
      amount: 5,
      reason: 'Approved tree_planted',
      chainTxHash: 'seeded-chain-tx-1'
    }
  });

  await prisma.impactUnit.upsert({
    where: { id: 'unit-1' },
    update: {},
    create: {
      id: 'unit-1',
      projectId: project1.id,
      submissionId: approved1.id,
      quantity: 1,
      maturityLevel: 'INITIAL',
      locked: false
    }
  });

  const approved2 = await prisma.submission.upsert({
    where: { id: 'approved-submission-2' },
    update: {},
    create: {
      id: 'approved-submission-2',
      userId: user.id,
      projectId: project2.id,
      speciesId: (await prisma.species.findFirst({ where: { commonName: 'Rowan' } })).id,
      type: SubmissionType.SURVIVAL_CHECK,
      title: 'Seedling survival check for community restoration',
      description: 'Verified survival of planted seedlings at community restoration site.',
      locationPrecision: 'city-level',
      evidenceHash: 'approved-hash-2',
      evidenceFilePath: 'storage/submissions/approved2.jpg',
      status: SubmissionStatus.APPROVED,
      reviewedById: admin.id,
      reviewedAt: new Date()
    }
  });

  await prisma.greenCoinLedger.upsert({
    where: { id: 'ledger-2' },
    update: {},
    create: {
      id: 'ledger-2',
      userId: user.id,
      submissionId: approved2.id,
      amount: 10,
      reason: 'Approved survival_check',
      chainTxHash: 'seeded-chain-tx-2'
    }
  });

  await prisma.impactUnit.upsert({
    where: { id: 'unit-2' },
    update: {},
    create: {
      id: 'unit-2',
      projectId: project2.id,
      submissionId: approved2.id,
      quantity: 1,
      maturityLevel: 'MATURE',
      locked: false
    }
  });

  console.log('Seed data created.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
