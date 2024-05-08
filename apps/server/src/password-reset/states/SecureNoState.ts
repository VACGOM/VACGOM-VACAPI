import { PasswordResetState } from '../password-reset.state';
import { Injectable } from '@nestjs/common';

import { NipService } from '../../nip/nip.service';
import { DomainException } from '../../exception/domain-exception';
import { ErrorCode } from '../../exception/error';
import { ResetPasswordRequest, StateType } from '@vacgom/types';

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
    return this.context.data.secureNoImage;
  }

  public async refreshSecureNoImage(): Promise<string> {
    try {
      await this.inputSecureNo('');
    } catch (e) {
      // do nothing
    }

    return this.context.data.secureNoImage;
  }

  public async inputSecureNo(secureNo: string): Promise<boolean> {
    try {
      const savedRequest = this.context.data.requestInfo;

      const response = await this.nipService.requestPasswordReset({
        type: 'InputSecureNo',
        secureNo: secureNo,
        secureNoRefresh: '0',
        name: savedRequest.name,
        identity: savedRequest.identity,
        newPassword: savedRequest.newPassword,
        telecom: savedRequest.telecom,
        phoneNumber: savedRequest.phoneNumber,
        twoWayInfo: this.context.data.twoWayInfo,
      });

      if (response.type == 'SecureNo') {
        this.context.data.secureNoImage = response.secureNoImage;
        this.context.data.twoWayInfo = response.twoWayInfo;
        await this.context.save();

        throw new DomainException(ErrorCode.SECURE_NO_ERROR_REFRESHED);
      } else if (response.type == 'SMS') {
        this.context.changeState(StateType.SMS);
        return true;
      }
    } catch (e) {
      if (!(e instanceof DomainException)) {
        throw e;
      }

      if (
        e.errorData == ErrorCode.VERIFICATION_BLOCKED ||
        e.errorData == ErrorCode.INVALID_INFO
      ) {
        this.context.changeState(StateType.INITIAL);
        throw e;
      } else if (
        e.errorData == ErrorCode.SECURE_NO_ERROR ||
        e.errorData == ErrorCode.DUPLICATE_REQUEST ||
        e.errorData == ErrorCode.TIMEOUT_ERROR
      ) {
        this.context.changeState(StateType.INITIAL);
        await this.context.requestPasswordChange(this.context.data.requestInfo);
        await this.context.requestSecureNoImage();
        await this.context.save();

        throw new DomainException(ErrorCode.SECURE_NO_ERROR_REFRESHED);
      } else {
        throw e;
      }
    }
  }
}
