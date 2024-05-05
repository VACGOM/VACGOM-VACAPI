import { Inject, Injectable } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { RequestService } from '../request/types';
import { CodefResponse } from './types/common/codef.response';
import { validateResponse } from './validate-response';
import { PasswordService } from './password.service';
import {
  CodefResetPasswordRequest,
  CodefTwoWaySecureNoInputRequest,
} from './types/reset-password/reset-password.request';
import {
  CodefPasswordChangedResponse,
  CodefSecureNoResponse,
  CodefSMSResponse,
} from './types/reset-password/reset-password.response';
import { isRight } from 'fp-ts/Either';
import { isTwoWay } from './types/reset-password/utils';
import { isLeft } from 'fp-ts/These';

@Injectable()
export class CodefService {
  constructor(
    @Inject('CodefRequestService')
    private requestService: RequestService,
    private credentialService: CredentialService,
    private passwordService: PasswordService
  ) {}

  async resetPassword(
    request: CodefResetPasswordRequest | CodefTwoWaySecureNoInputRequest
  ): Promise<
    CodefSecureNoResponse | CodefSMSResponse | CodefPasswordChangedResponse
  > {
    if (request.userPassword) {
      request.userPassword = this.passwordService.encryptPassword(
        request.userPassword
      );
    }
    const response = await this.requestService.post<
      CodefResetPasswordRequest | CodefTwoWaySecureNoInputRequest,
      CodefSecureNoResponse | CodefSMSResponse | CodefPasswordChangedResponse
    >(
      'https://development.codef.io/v1/kr/public/hw/nip-cdc-list/finding-id-pw',
      request
    );

    validateResponse(response);

    if (isTwoWay(response)) {
      if (response.data.method === 'secureNo') {
        const result = CodefSecureNoResponse.decode(response);
        if (isLeft(result)) {
          console.log('Invalid response', result.left);
        }
        if (isRight(result)) return result.right;
      } else if (response.data.method === 'smsAuthNo') {
        const result = CodefSMSResponse.decode(response);
        if (isRight(result)) return result.right;
      }
    } else {
      const result = CodefPasswordChangedResponse.decode(response);
      if (isRight(result)) return result.right;
    }
  }

  async getVaccinationRecords(
    id: string,
    password: string
  ): Promise<CodefResponse<any>> {
    return validateResponse<CodefResponse<any>>(null);
  }
}
