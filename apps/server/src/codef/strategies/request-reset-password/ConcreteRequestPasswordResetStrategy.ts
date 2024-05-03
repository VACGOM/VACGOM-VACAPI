import { RequestPasswordResetStrategy } from '../../../nip/strategies/resetPassword/RequestPasswordResetStrategy';
import {
  ResetPasswordRequest,
  SecureNoRequest,
  SecureNoResponse,
  SMSCodeRequest,
} from '../../../nip/strategies/resetPassword/request';
import { CodefService } from '../../codef.service';
import { ResetPasswordResponse } from '../../dtos/reset-password/reset-password.response';
import { Injectable } from '@nestjs/common';
import { RequestResetPasswordMapper } from './mapper';

@Injectable()
export class ConcreteRequestPasswordResetStrategy
  implements RequestPasswordResetStrategy
{
  constructor(
    private codefService: CodefService,
    private mapperService: RequestResetPasswordMapper
  ) {}

  async requestPasswordReset(
    request: ResetPasswordRequest
  ): Promise<SecureNoResponse> {
    const response = await this.codefService.resetPassword(
      this.mapperService.toCodefResetPasswordRequest(request)
    );

    if (!(response instanceof ResetPasswordResponse)) {
      throw new Error('Invalid response type');
    }

    return {
      isTwoWay: response.continue2Way,
      jobIndex: response.jobIndex,
      threadIndex: response.threadIndex,
      jti: response.jti,
      twoWayTimestamp: parseInt(response.twoWayTimestamp),
      data: {
        secureNoImage: response.extraInfo.reqSecureNo,
      },
    };
  }

  requestSMSCode(request: SMSCodeRequest): Promise<ResetPasswordRequest> {
    return Promise.resolve(undefined);
  }

  requestSecureNo(request: SecureNoRequest): Promise<SecureNoResponse> {
    return Promise.resolve(undefined);
  }
}
