import { Inject, Injectable } from '@nestjs/common';
import { PasswordResetContext } from './password-reset.context';
import { InitialState } from './states/InitialState';
import { SecureNoState } from './states/SecureNoState';
import { RequestPasswordReset } from './states/RequestPasswordReset';
import { States } from './types/state';
import { ContextRepository } from './context.repository';
import { Context } from './types/context';
import { SMSState } from './states/SMSState';
import { StateType } from '@vacgom/types';

@Injectable()
export class ContextFactory {
  readonly states: States;

  constructor(
    @Inject('ContextRepository')
    private repository: ContextRepository,
    private initialState: InitialState,
    private requestPasswordReset: RequestPasswordReset,
    private secureNoState: SecureNoState,
    private smsState: SMSState
  ) {
    this.states = {
      [StateType.INITIAL]: this.initialState,
      [StateType.REQUEST_PASSWORD_RESET]: this.requestPasswordReset,
      [StateType.SECURE_NO]: this.secureNoState,
      [StateType.SMS]: this.smsState,
    };
  }

  public create(
    state = StateType.INITIAL,
    data: Context
  ): PasswordResetContext {
    return new PasswordResetContext(this.states, this.repository, state, data);
  }

  public createInitialState(memberId: string): PasswordResetContext {
    return this.create(StateType.INITIAL, {
      memberId: memberId,
      stateType: StateType.INITIAL.toString(),
      requestInfo: null,
      secureNoImage: null,
      twoWayInfo: null,
    });
  }
}
