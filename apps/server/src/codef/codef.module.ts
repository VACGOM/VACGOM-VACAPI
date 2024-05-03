import { Module } from '@nestjs/common';
import { CodefService } from './codef.service';
import { CredentialService } from './credential.service';
import { CodefRequestService } from './request.service';
import { CommonRequestService } from '../request/request.service';
import { RequestResetPasswordMapper } from './strategies/request-reset-password/mapper';
import { PasswordService } from './password.service';
import { ConcreteFetchMyVaccinationStrategy } from './strategies/fetch-my-vaccination/ConcreteFetchMyVaccinationStrategy';
import { ConcreteRequestPasswordResetStrategy } from './strategies/request-reset-password/ConcreteRequestPasswordResetStrategy';

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
    RequestResetPasswordMapper,
    PasswordService,
    ConcreteFetchMyVaccinationStrategy,
    ConcreteRequestPasswordResetStrategy,
  ],
  exports: [
    CodefService,
    ConcreteFetchMyVaccinationStrategy,
    ConcreteRequestPasswordResetStrategy,
  ],
})
export class CodefModule {}
