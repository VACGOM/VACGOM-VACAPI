import { Inject, Injectable } from '@nestjs/common';
import {
  PasswordResetContext,
  PasswordResetStateKeys,
  PasswordResetStateType,
} from './password-reset.context';
import { InitialState } from './states/InitialState';
import { SecureNoState } from './states/SecureNoState';
import { RequestPasswordReset } from './states/RequestPasswordReset';
import { PasswordResetData } from './types/passwordResetData';
import { SMSState } from './states/SMSState';
import { PasswordResetState } from './password-reset.state';
import { StateMap } from '../context/context';
import { ContextRepository } from '../context/repository';
import { Data } from '../context/data';

@Injectable()
export class ContextFactory {
  private states: StateMap<PasswordResetStateKeys, PasswordResetState>;

  constructor(
    @Inject('ContextRepository')
    private repository: ContextRepository<PasswordResetContext>,
    private initialState: InitialState,
    private requestPasswordReset: RequestPasswordReset,
    private secureNoState: SecureNoState,
    private smsState: SMSState
  ) {
    this.states = new Map([
      [PasswordResetStateType.INITIAL, this.initialState],
      [PasswordResetStateType.SMS, this.smsState],
      [PasswordResetStateType.SECURE_NO, this.secureNoState],
      [
        PasswordResetStateType.REQUEST_PASSWORD_RESET,
        this.requestPasswordReset,
      ],
    ]);
  }

  public create(
    state = PasswordResetStateType.INITIAL,
    payload: PasswordResetData
  ): PasswordResetContext {
    const data: Data<PasswordResetState, PasswordResetData> = {
      state: this.states[state],
      payload: payload,
    };

    return new PasswordResetContext(this.states, this.repository, data);
  }

  public createInitialState(memberId: string): PasswordResetContext {
    return this.create(PasswordResetStateType.INITIAL, {
      isRemoved: false,
      memberId: memberId,
      requestInfo: null,
      secureNoImage: null,
      twoWayInfo: null,
    });
  }
}
