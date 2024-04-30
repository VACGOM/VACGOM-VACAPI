import { Module } from '@nestjs/common';
import { CodefService } from './codef.service';
import { CredentialService } from './credential.service';
import { CodefController } from './codef.controller';
import { CodefRequestService } from './request.service';
import { CommonRequestService } from '../request/request.service';

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
  ],
  controllers: [CodefController],
})
export class CodefModule {}
