import { PasswordResetState } from '../password-reset.state';
import { Injectable } from '@nestjs/common';

import { NipService } from '../../nip/nip.service';
import { DomainException } from '../../exception/domain-exception';
import { ErrorCode } from '../../exception/error';
import { ResetPasswordRequest } from '@vacgom/types';
import { NipRefreshSecureNoRequest } from '../../nip/strategies/resetPassword/request';
import {
  PasswordResetStateKeys,
  PasswordResetStateType,
} from '../password-reset.context';

@Injectable()
export class SecureNoState extends PasswordResetState {
  constructor(private nipService: NipService) {
    super();
  }

  public async requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    this.context.changeState(PasswordResetStateType.INITIAL);
    return this.context.requestPasswordChange(request);
  }

  public async requestSecureNoImage(): Promise<string> {
    return this.context.getPayload().secureNoImage;
  }

  public async refreshSecureNoImage(): Promise<string> {
    const savedRequest = this.context.getPayload().requestInfo;
    const request: NipRefreshSecureNoRequest = {
      type: 'RefreshSecureNo',
      secureNoRefresh: '1',
      ...savedRequest,
      twoWayInfo: {
        ...this.context.getPayload().twoWayInfo,
      },
    };

    const response = await this.nipService.requestPasswordReset(request);

    if (response.type == 'SecureNo') {
      this.context.getPayload().secureNoImage = response.secureNoImage;
      await this.context.save();
      return response.secureNoImage;
    } else {
      throw new DomainException(
        ErrorCode.SECURE_NO_ERROR,
        '안전번호 이미지를 갱신할 수 없습니다.'
      );
    }
  }

  public async inputSecureNo(secureNo: string): Promise<boolean> {
    try {
      const savedRequest = this.context.getPayload().requestInfo;

      const response = await this.nipService.requestPasswordReset({
        type: 'InputSecureNo',
        secureNo: secureNo,
        secureNoRefresh: '0',
        name: savedRequest.name,
        identity: savedRequest.identity,
        newPassword: savedRequest.newPassword,
        telecom: savedRequest.telecom,
        phoneNumber: savedRequest.phoneNumber,
        twoWayInfo: this.context.getPayload().twoWayInfo,
      });

      if (response.type == 'SecureNo') {
        this.context.getPayload().secureNoImage = response.secureNoImage;
        this.context.getPayload().twoWayInfo = response.twoWayInfo;
        await this.context.save();

        throw new DomainException(ErrorCode.SECURE_NO_ERROR_REFRESHED);
      } else if (response.type == 'SMS') {
        this.context.changeState(PasswordResetStateType.SMS);
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
        await this.context.resetContext();
        throw e;
      } else if (
        e.errorData == ErrorCode.SECURE_NO_ERROR ||
        e.errorData == ErrorCode.DUPLICATE_REQUEST ||
        e.errorData == ErrorCode.TIMEOUT_ERROR
      ) {
        this.context.changeState(PasswordResetStateType.INITIAL);
        await this.context.requestPasswordChange(
          this.context.getPayload().requestInfo
        );
        await this.context.requestSecureNoImage();
        await this.context.save();

        throw new DomainException(ErrorCode.SECURE_NO_ERROR_REFRESHED);
      } else {
        throw e;
      }
    }
  }

  getStateType(): PasswordResetStateKeys {
    return PasswordResetStateType.SECURE_NO;
  }
}
