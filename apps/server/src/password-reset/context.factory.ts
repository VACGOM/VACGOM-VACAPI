import { Inject, Injectable } from '@nestjs/common';
import { PasswordResetContext } from './password-reset.context';
import { StateType } from './password-reset.state';
import { InitialState } from './states/InitialState';
import { SecureNoState } from './states/SecureNoState';
import { RequestPasswordReset } from './states/RequestPasswordReset';
import { States } from './types/state';
import { RequestInfo } from './request';
import { ResetPasswordRequest } from '../nip/strategies/resetPassword/request';
import { ContextRepository } from './context.repository';

@Injectable()
export class ContextFactory {
  readonly states: States;

  constructor(
    @Inject('ContextRepository')
    private repository: ContextRepository,
    private initialState: InitialState,
    private requestPasswordReset: RequestPasswordReset,
    private secureNoState: SecureNoState
  ) {
    this.states = {
      [StateType.INITIAL]: this.initialState,
      [StateType.REQUEST_PASSWORD_RESET]: this.requestPasswordReset,
      [StateType.SECURE_NO]: this.secureNoState,
    };
  }

  public create(
    memberId: string,
    requestInfo = new RequestInfo<ResetPasswordRequest>(),
    state = StateType.INITIAL
  ): PasswordResetContext {
    return new PasswordResetContext(
      this.states,
      this.repository,
      memberId,
      requestInfo,
      state
    );
  }
}
