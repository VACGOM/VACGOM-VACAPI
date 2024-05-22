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
    const response = await this.nipService.requestPasswordReset(
      this.buildSecureNoRequest()
    );

    if (response.type != 'SecureNo') {
      throw new DomainException(
        ErrorCode.SECURE_NO_ERROR,
        '안전번호 이미지를 갱신할 수 없습니다.'
      );
    }

    this.context.setPayload({
      ...this.context.getPayload(),
      secureNoImage: response.secureNoImage,
      twoWayInfo: response.twoWayInfo,
    });

    return response.secureNoImage;
  }

  public async inputSecureNo(secureNo: string): Promise<boolean> {
    return this.process(secureNo).catch((e) => this.handleError(e));
  }

  getStateType(): PasswordResetStateKeys {
    return PasswordResetStateType.SECURE_NO;
  }

  private async process(secureNo: string): Promise<boolean> {
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
      this.context.setPayload({
        ...this.context.getPayload(),
        secureNoImage: response.secureNoImage,
        twoWayInfo: response.twoWayInfo,
      });
      await this.context.save();

      throw new DomainException(ErrorCode.SECURE_NO_ERROR_REFRESHED);
    } else if (response.type == 'SMS') {
      this.context.changeState(PasswordResetStateType.SMS);
      return true;
    }
  }

  private async handleError(e: Error): Promise<never> {
    if (!(e instanceof DomainException)) {
      throw e;
    }
    const payload = this.context.getPayload();

    switch (e.errorData) {
      case ErrorCode.VERIFICATION_BLOCKED:
      case ErrorCode.INVALID_INFO:
        await this.context.resetContext();
        throw e;
      case ErrorCode.SECURE_NO_ERROR:
      case ErrorCode.DUPLICATE_REQUEST:
      case ErrorCode.TIMEOUT_ERROR:
        await this.context.resetContext();
        await this.context.requestPasswordChange(payload.requestInfo);
        await this.context.requestSecureNoImage();
        await this.context.save();

        throw new DomainException(ErrorCode.SECURE_NO_ERROR_REFRESHED);
      default:
        throw e;
    }
  }

  private buildSecureNoRequest(): NipRefreshSecureNoRequest {
    return {
      type: 'RefreshSecureNo',
      secureNoRefresh: '1',
      ...this.context.getPayload().requestInfo,
      twoWayInfo: {
        ...this.context.getPayload().twoWayInfo,
      },
    };
  }
}
