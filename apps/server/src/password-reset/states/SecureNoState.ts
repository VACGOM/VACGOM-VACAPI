import { PasswordResetState, StateType } from '../password-reset.state';
import { Injectable } from '@nestjs/common';
import {
  ResetPasswordRequest,
  SMSCodeRequest,
} from '../../nip/strategies/resetPassword/request';
import { NipService } from '../../nip/nip.service';
import {
  SecureNoResponse,
  SMSResponse,
} from '../../nip/strategies/resetPassword/response';
import { DomainException } from '../../exception/domain-exception';
import { ErrorCode } from '../../exception/error';

@Injectable()
export class SecureNoState extends PasswordResetState {
  constructor(private nipService: NipService) {
    super();
  }

  public async requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    this.context.changeState(StateType.INITIAL);
    return this.context.state.requestPasswordChange(request);
  }

  public async requestSecureNoImage(): Promise<string> {
    return this.context.secureNoImage;
  }

  public async inputSecureNo(secureNo: string): Promise<boolean> {
    const request = this.context.request;
    const smsCodeRequest = new SMSCodeRequest(
      request.data.name,
      request.data.identity,
      request.data.newPassword,
      request.data.telecom,
      request.data.phoneNumber,
      secureNo,
      '0',
      request.twoWayInfo
    );

    try {
      const response = await this.nipService.requestPasswordReset(
        smsCodeRequest
      );

      if (response instanceof SecureNoResponse) {
        this.context.secureNoImage = response.secureNoImage;
        await this.context.save();

        return false;
      } else if (response instanceof SMSResponse) {
        console.log('SMS State로 전환 !!');
        return true;
      }
    } catch (e) {
      if (!(e instanceof DomainException)) {
        throw e;
      }

      if (
        e.errorData == ErrorCode.SECURE_NO_ERROR ||
        e.errorData == ErrorCode.DUPLICATE_REQUEST ||
        e.errorData == ErrorCode.TIMEOUT_ERROR
      ) {
        this.context.changeState(StateType.INITIAL);
        await this.context.requestPasswordChange(this.context.request.data);

        return false;
      } else {
        throw e;
      }
    }
  }
}
