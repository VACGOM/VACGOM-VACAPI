import { Module } from '@nestjs/common';
import { CodefService } from './codef.service';
import { CredentialService } from './credential.service';
import { CodefRequestService } from './request.service';
import { CommonRequestService } from '../request/request.service';
import { CodefVaccinationFetcher } from './vaccination/codef-vaccination-fetcher';

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
    CodefVaccinationFetcher,
  ],
  exports: [CodefVaccinationFetcher],
})
export class CodefModule {}
