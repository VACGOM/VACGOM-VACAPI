import { PasswordResetState, StateType } from '../password-reset.state';
import { Injectable } from '@nestjs/common';
import { ResetPasswordRequest } from '../../nip/strategies/resetPassword/request';

@Injectable()
export class SecureNoState extends PasswordResetState {
  public async requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    this.context.changeState(StateType.INITIAL);
    return this.context.state.requestPasswordChange(request);
  }
}
