import { Inject, Injectable } from '@nestjs/common';
import { VaccinationRecordRequest } from './vaccination/types/vaccination-record.request';
import { CredentialService } from './credential.service';
import NodeRSA from 'node-rsa';
import { RequestService } from '../request/types';
import { CodefResponse } from './types/common/codef.response';

@Injectable()
export class CodefService {
  constructor(
    @Inject('CodefRequestService')
    private requestService: RequestService,
    private credentialService: CredentialService
  ) {}

  public encryptPassword(password: string): string {
    const key = new NodeRSA();
    key.importKey(this.credentialService.getPublicKey(), 'pkcs8-public');
    key.setOptions({ encryptionScheme: 'pkcs1' });

    return key.encrypt(password, 'base64');
  }

  async getVaccinationRecords(
    id: string,
    password: string
  ): Promise<CodefResponse<never>> {
    const response = await this.requestService.post<CodefResponse<never>>(
      'https://development.codef.io/v1/kr/public/hw/nip-cdc-list/my-vaccination',
      new VaccinationRecordRequest(id, this.encryptPassword(password))
    );

    return response;
  }
}
