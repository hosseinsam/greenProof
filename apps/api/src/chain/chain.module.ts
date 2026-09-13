import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MockCosmosRegistryAdapter } from './mock-cosmos-registry.adapter';
import { CosmjsCosmosRegistryAdapter } from './cosmjs-cosmos-registry.adapter';
import { PrismaService } from '../prisma/prisma.service';
import { ChainRegistryAdapter } from '../common/interfaces/chain-registry.adapter';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: ChainRegistryAdapter,
      inject: [ConfigService, PrismaService],
      useFactory: (config: ConfigService, prisma: PrismaService) => {
        if (config.get<string>('CHAIN_MODE') === 'cosmos') {
          return new CosmjsCosmosRegistryAdapter();
        }
        return new MockCosmosRegistryAdapter(prisma);
      }
    }
  ],
  exports: [ChainRegistryAdapter]
})
export class ChainModule {}
