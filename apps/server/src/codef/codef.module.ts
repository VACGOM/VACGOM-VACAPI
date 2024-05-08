import { Module } from '@nestjs/common';
import { CodefService } from './codef.service';
import { CredentialService } from './credential.service';
import { CodefRequestService } from './request.service';
import { CommonRequestService } from '../request/request.service';
import { PasswordService } from './password.service';
import { ConcreteFetchMyVaccinationStrategy } from './strategies/fetch-my-vaccination/ConcreteFetchMyVaccinationStrategy';
import { ConcreteRequestPasswordResetStrategy } from './strategies/request-reset-password/ConcreteRequestPasswordResetStrategy';
import { Mapper } from './strategies/request-reset-password/mapper';
import { FetchMyVaccinationMapper } from './strategies/fetch-my-vaccination/mapper';

@Module({
  providers: [
    CodefService,
    CredentialService,
    {
      provide: 'CodefRequestService',
      useClass: CodefRequestService,
    },
    {
      provide: 'RequestService',
      useClass: CommonRequestService,
    },
    PasswordService,
    ConcreteFetchMyVaccinationStrategy,
    ConcreteRequestPasswordResetStrategy,
    Mapper,
    FetchMyVaccinationMapper,
  ],
  exports: [
    CodefService,
    ConcreteFetchMyVaccinationStrategy,
    ConcreteRequestPasswordResetStrategy,
  ],
})
export class CodefModule {}
