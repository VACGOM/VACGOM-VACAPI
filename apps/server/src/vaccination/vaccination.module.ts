import { Module } from '@nestjs/common';
import { CodefModule } from '../codef/codef.module';
import { VaccinationController } from './vaccination.controller';
import { NipModule } from '../nip/nip.module';
import { VaccinationCacheService } from './cache.service';
import { CacheVaccinationMiddleware } from './cache-vaccination.middleware';

@Module({
  imports: [CodefModule, NipModule],
  providers: [
    VaccinationController,
    VaccinationCacheService,
    CacheVaccinationMiddleware,
  ],
})
export class VaccinationModule {}
