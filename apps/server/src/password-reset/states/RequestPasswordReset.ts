import { PasswordResetState } from '../password-reset.state';

import { Injectable } from '@nestjs/common';
import { ResetPasswordRequest } from '@vacgom/types';
import {
  PasswordResetStateKeys,
  PasswordResetStateType,
} from '../password-reset.context';

@Injectable()
export class RequestPasswordReset extends PasswordResetState {
  constructor() {
    super();
  }

  public async requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    this.context.changeState(PasswordResetStateType.INITIAL);
    return this.context.requestPasswordChange(request);
  }

  public async requestSecureNoImage(): Promise<string> {
    this.context.changeState(PasswordResetStateType.SECURE_NO);
    return this.context.getPayload().secureNoImage;
  }

  public getStateType(): PasswordResetStateKeys {
    return PasswordResetStateType.REQUEST_PASSWORD_RESET;
  }
}
