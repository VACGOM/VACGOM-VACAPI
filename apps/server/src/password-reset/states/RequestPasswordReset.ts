import { PasswordResetState, StateType } from '../password-reset.state';

import { Injectable } from '@nestjs/common';
import { ResetPasswordRequest } from '../../nip/strategies/resetPassword/request';

@Injectable()
export class RequestPasswordReset extends PasswordResetState {
  constructor() {
    super();
  }

  public async requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    this.context.changeState(StateType.INITIAL);
    return this.context.state.requestPasswordChange(request);
  }

  async requestSecureNoImage(): Promise<string> {
    if (this.context.secureNoImage == undefined) {
      throw new Error('안전번호 이미지가 없습니다.');
    }

    this.context.changeState(StateType.SECURE_NO);
    return this.context.secureNoImage;
  }
}
