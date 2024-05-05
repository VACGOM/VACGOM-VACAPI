import { PasswordResetState, StateType } from '../password-reset.state';
import { Injectable } from '@nestjs/common';

import { NipService } from '../../nip/nip.service';
import { DomainException } from '../../exception/domain-exception';
import { ErrorCode } from '../../exception/error';
import { ResetPasswordRequest } from '../types/reset-password.request';

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
    try {
      const savedRequest = this.context.request.data;

      const response = await this.nipService.requestPasswordReset({
        type: 'InputSecureNo',
        secureNo: secureNo,
        secureNoRefresh: '0',
        name: savedRequest.name,
        identity: savedRequest.identity,
        newPassword: savedRequest.newPassword,
        telecom: savedRequest.telecom,
        phoneNumber: savedRequest.phoneNumber,
        twoWayInfo: this.context.request.twoWayInfo,
      });

      if (response.type == 'SecureNo') {
        this.context.secureNoImage = response.secureNoImage;
        await this.context.save();

        return false;
      } else if (response.type == 'SMS') {
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
