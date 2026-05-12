import { Global, Module } from '@nestjs/common';
import { MockCosmosRegistryAdapter } from './mock-cosmos-registry.adapter';
import { PrismaService } from '../prisma/prisma.service';
import { ChainRegistryAdapter } from '../common/interfaces/chain-registry.adapter';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: ChainRegistryAdapter,
      useClass: MockCosmosRegistryAdapter
    }
  ],
  exports: [ChainRegistryAdapter]
})
export class ChainModule {}
