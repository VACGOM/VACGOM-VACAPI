import { PasswordResetState } from '../password-reset.state';

import { Injectable } from '@nestjs/common';
import { ResetPasswordRequest, StateType } from '@vacgom/types';

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

  public async requestSecureNoImage(): Promise<string> {
    if (this.context.data.secureNoImage == undefined) {
      throw new Error('안전번호 이미지가 없습니다.');
    }

    this.context.changeState(StateType.SECURE_NO);
    return this.context.data.secureNoImage;
  }
}
