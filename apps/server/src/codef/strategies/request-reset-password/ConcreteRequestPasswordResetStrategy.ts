import { RequestPasswordResetStrategy } from '../../../nip/strategies/resetPassword/RequestPasswordResetStrategy';
import {
  ResetPasswordRequest,
  SMSCodeRequest,
} from '../../../nip/strategies/resetPassword/request';
import { CodefService } from '../../codef.service';
import {
  CodefResetPassword2WayResponse,
  CodefResetPasswordSecureNo2WayResponse,
  CodefResetPasswordSuccessResponse,
} from '../../dtos/reset-password/reset-password.response';
import { Injectable } from '@nestjs/common';
import { SecureNoResponse } from '../../../nip/strategies/resetPassword/response';
import {
  CodefResetPasswordRequest,
  TwoWayResetPasswordRequest,
} from '../../dtos/reset-password/codef-reset-password.request';
import { PasswordService } from '../../password.service';

@Injectable()
export class ConcreteRequestPasswordResetStrategy
  implements RequestPasswordResetStrategy
{
  constructor(
    private codefService: CodefService,
    private passwordService: PasswordService
  ) {}

  async requestPasswordReset(
    request: ResetPasswordRequest | SMSCodeRequest
  ): Promise<SecureNoResponse> {
    let response:
      | SecureNoResponse
      | CodefResetPassword2WayResponse
      | CodefResetPasswordSuccessResponse;

    request.newPassword = this.passwordService.encryptPassword(
      request.newPassword
    );

    if (request instanceof SMSCodeRequest) {
      response = await this.codefService.resetPassword(
        TwoWayResetPasswordRequest.fromRequest(request)
      );
    } else {
      response = await this.codefService.resetPassword(
        CodefResetPasswordRequest.fromRequest(request)
      );
    }

    if (response instanceof CodefResetPasswordSecureNo2WayResponse) {
      return new SecureNoResponse(response.extraInfo.reqSecureNo, {
        jobIndex: response.jobIndex,
        threadIndex: response.threadIndex,
        jti: response.jti,
        twoWayTimestamp: response.twoWayTimestamp,
      });
    } else {
      console.log(response);
    }
  }

  requestSMSCode(request: SMSCodeRequest): Promise<ResetPasswordRequest> {
    return Promise.resolve(undefined);
  }

  requestSecureNo(request: SecureNoResponse): Promise<SecureNoResponse> {
    return Promise.resolve(undefined);
  }
}
