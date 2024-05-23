import { PasswordResetState } from '../password-reset.state';
import { Injectable } from '@nestjs/common';

import { NipService } from '../../nip/nip.service';
import { DomainException } from '../../exception/domain-exception';
import { ErrorCode } from '../../exception/error';
import {
  PasswordChangeSuccessResponse,
  ResetPasswordRequest,
} from '@vacgom/types';
import {
  PasswordResetStateKeys,
  PasswordResetStateType,
} from '../password-reset.context';

@Injectable()
export class SMSState extends PasswordResetState {
  constructor(private nipService: NipService) {
    super();
  }

  public async requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    this.context.changeState(PasswordResetStateType.INITIAL);
    return this.context.requestPasswordChange(request);
  }

  public async inputSMSCode(
    smsCode: string
  ): Promise<PasswordChangeSuccessResponse> {
    const payload = this.context.getPayload();
    const savedRequest = payload.requestInfo;

    return this.process(smsCode, savedRequest).catch((e) =>
      this.handleError(e, payload)
    );
  }

  getStateType(): PasswordResetStateKeys {
    return PasswordResetStateType.SMS;
  }

  private async process(smsCode: string, savedRequest: ResetPasswordRequest) {
    const response = await this.nipService.requestPasswordReset({
      type: 'InputSMS',
      smsAuthNo: smsCode,
      name: savedRequest.name,
      identity: savedRequest.identity,
      newPassword: savedRequest.newPassword,
      telecom: savedRequest.telecom,
      phoneNumber: savedRequest.phoneNumber,
      twoWayInfo: this.context.getPayload().twoWayInfo,
    });

    if (response.type == 'PasswordChangeFailed') {
      throw new DomainException(
        ErrorCode.PASSWORD_RESET_FAILED,
        response.result
      );
    } else if (response.type != 'PasswordChanged') {
      throw new DomainException(ErrorCode.PASSWORD_RESET_FAILED);
    }

    await this.context.resetContext();
    return {
      userId: response.userId,
    };
  }

  private async handleError(e: Error, payload: any): Promise<never> {
    if (!(e instanceof DomainException)) {
      throw e;
    }

    if (e.errorData == ErrorCode.TIMEOUT_ERROR) {
      this.context.changeState(PasswordResetStateType.INITIAL);
      await this.context.requestPasswordChange(payload.requestInfo);
    } else if (e.errorData == ErrorCode.DUPLICATE_REQUEST) {
      await this.context.resetContext();
    } else if (e.errorData == ErrorCode.PASSWORD_RESET_FAILED) {
      this.context.changeState(PasswordResetStateType.REQUEST_PASSWORD_RESET);
    }

    throw e;
  }
}
