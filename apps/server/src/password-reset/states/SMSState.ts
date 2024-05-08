import { PasswordResetState } from '../password-reset.state';
import { Injectable } from '@nestjs/common';

import { NipService } from '../../nip/nip.service';
import { DomainException } from '../../exception/domain-exception';
import { ErrorCode } from '../../exception/error';
import { ResetPasswordRequest, StateType } from '@vacgom/types';

@Injectable()
export class SMSState extends PasswordResetState {
  constructor(private nipService: NipService) {
    super();
  }

  public async requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    this.context.changeState(StateType.INITIAL);
    return this.context.state.requestPasswordChange(request);
  }

  public async inputSMSCode(smsCode: string): Promise<boolean> {
    const savedRequest = this.context.data.requestInfo;

    try {
      const response = await this.nipService.requestPasswordReset({
        type: 'InputSMS',
        smsAuthNo: smsCode,
        name: savedRequest.name,
        identity: savedRequest.identity,
        newPassword: savedRequest.newPassword,
        telecom: savedRequest.telecom,
        phoneNumber: savedRequest.phoneNumber,
        twoWayInfo: this.context.data.twoWayInfo,
      });

      if (response.type == 'PasswordChangeFailed') {
        this.context.changeState(StateType.REQUEST_PASSWORD_RESET);
        throw new DomainException(
          {
            code: ErrorCode.CODEF_ERROR.code,
            message: response.result,
            success: false,
          },
          response.result
        );
      }
      return true;
    } catch (e) {
      if (e instanceof DomainException) {
        if (e.errorData == ErrorCode.TIMEOUT_ERROR) {
          this.context.changeState(StateType.INITIAL);
          await this.context.requestPasswordChange(
            this.context.data.requestInfo
          );
          throw new DomainException(ErrorCode.TIMEOUT_ERROR, e.message);
        } else if (e.errorData == ErrorCode.DUPLICATE_REQUEST) {
          this.context.changeState(StateType.INITIAL);
          throw new DomainException(ErrorCode.DUPLICATE_REQUEST, e.message);
        }
      }
      throw e;
    }
  }
}
