import { Module } from '@nestjs/common';
import { NipService } from './nip.service';
import { FetchMyVaccinationStrategy } from './strategies/fetchMyVaccination/FetchMyVaccinationStrategy';
import { ConcreteFetchMyVaccinationStrategy } from '../codef/strategies/fetch-my-vaccination/ConcreteFetchMyVaccinationStrategy';
import { RequestPasswordResetStrategy } from './strategies/resetPassword/RequestPasswordResetStrategy';
import { ConcreteRequestPasswordResetStrategy } from '../codef/strategies/request-reset-password/ConcreteRequestPasswordResetStrategy';
import { CodefModule } from '../codef/codef.module';

@Module({
  imports: [CodefModule],
  controllers: [],
  exports: [NipService],
  providers: [
    NipService,
    {
      provide: FetchMyVaccinationStrategy,
      useExisting: ConcreteFetchMyVaccinationStrategy,
    },
    {
      provide: RequestPasswordResetStrategy,
      useExisting: ConcreteRequestPasswordResetStrategy,
    },
  ],
})
export class NipModule {}
