import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './config/environment';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { SpeciesModule } from './species/species.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { WalletModule } from './wallet/wallet.module';
import { ImpactPacksModule } from './impact-packs/impact-packs.module';
import { PurchasesModule } from './purchases/purchases.module';
import { CertificatesModule } from './certificates/certificates.module';
import { RegistryModule } from './registry/registry.module';
import { AuditModule } from './audit/audit.module';
import { ChainModule } from './chain/chain.module';
import { AdminModule } from './admin/admin.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    SpeciesModule,
    SubmissionsModule,
    WalletModule,
    ImpactPacksModule,
    PurchasesModule,
    CertificatesModule,
    RegistryModule,
    AuditModule,
    ChainModule,
    AdminModule,
    CompanyModule
  ]
})
export class AppModule {}
