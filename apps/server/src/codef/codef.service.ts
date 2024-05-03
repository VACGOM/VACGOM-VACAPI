import { Inject, Injectable } from '@nestjs/common';
import { VaccinationRecordRequest } from './strategies/fetch-my-vaccination/types/vaccination-record.request';
import { CredentialService } from './credential.service';
import { RequestService } from '../request/types';
import { CodefResponse } from './types/common/codef.response';
import { validateResponse } from './validate-response';
import { CodefMyVaccinationData } from './strategies/fetch-my-vaccination/types/vaccination-record.response';
import { PasswordService } from './password.service';
import { CodefResetPasswordRequest } from './dtos/reset-password/codef-reset-password.request';
import {
  ResetPasswordResponse,
  ResetPasswordSuccessResponse,
} from './dtos/reset-password/reset-password.response';

@Injectable()
export class CodefService {
  constructor(
    @Inject('CodefRequestService')
    private requestService: RequestService,
    private credentialService: CredentialService,
    private passwordService: PasswordService
  ) {}

  async resetPassword(
    request: CodefResetPasswordRequest
  ): Promise<ResetPasswordResponse | ResetPasswordSuccessResponse> {
    const response = await this.requestService.post<
      CodefResetPasswordRequest,
      CodefResponse<any>
    >(
      'https://development.codef.io/v1/kr/public/hw/nip-cdc-list/finding-id-pw',
      request
    );

    validateResponse(response);

    if (response.data.continue2Way) {
      return new ResetPasswordResponse(response.data);
    } else {
      return new ResetPasswordSuccessResponse(response.data);
    }
  }

  async getVaccinationRecords(
    id: string,
    password: string
  ): Promise<CodefResponse<CodefMyVaccinationData>> {
    const response = await this.requestService.post<
      VaccinationRecordRequest,
      CodefResponse<never>
    >(
      'https://development.codef.io/v1/kr/public/hw/nip-cdc-list/my-vaccination',
      new VaccinationRecordRequest(
        id,
        this.passwordService.encryptPassword(password)
      )
    );

    return validateResponse<CodefResponse<CodefMyVaccinationData>>(response);
  }
}
