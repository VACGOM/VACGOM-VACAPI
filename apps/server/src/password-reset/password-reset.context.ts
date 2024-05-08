import { PasswordResetState } from './password-reset.state';
import { States } from './types/state';
import { ContextRepository } from './context.repository';
import { isLeft } from 'fp-ts/These';

import { Context } from './types/context';
import { ValidationError } from './exception/ValidationError';
import {
  InputSecureNoRequest,
  InputSMSCodeRequest,
  ResetPasswordRequest,
  StateType,
} from '@vacgom/types';
import { PasswordResetContextType } from '../../../../libs/types/src/password-reset/context';

export class PasswordResetContext implements PasswordResetContextType {
  state: PasswordResetState;

  public data!: Context;

  constructor(
    private states: States,
    private repository: ContextRepository,
    state: StateType,
    data: Context
  ) {
    this.data = data;
    this.changeState(state);
  }

  public getCurrentState(): string {
    return this.data.stateType;
  }

  public changeState(state: StateType) {
    this.state = this.states[state];
    this.data.stateType = state;

    this.state.setContext(this);
  }

  public async requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    const decoded = ResetPasswordRequest.decode(request);
    if (isLeft(decoded)) {
      throw new ValidationError(decoded.left);
    }

    return this.operate(() => this.state.requestPasswordChange(decoded.right));
  }

  public async requestSecureNoImage(): Promise<any> {
    return this.operate(() => this.state.requestSecureNoImage());
  }

  public async inputSecureNo(request: InputSecureNoRequest): Promise<any> {
    const decoded = InputSecureNoRequest.decode(request);
    if (isLeft(decoded)) {
      throw new ValidationError(decoded.left);
    }

    return this.operate(() => this.state.inputSecureNo(decoded.right.secureNo));
  }

  public async inputSMSCode(request: InputSMSCodeRequest): Promise<any> {
    const decoded = InputSMSCodeRequest.decode(request);
    if (isLeft(decoded)) {
      throw new ValidationError(decoded.left);
    }

    return this.operate(() => this.state.inputSMSCode(decoded.right.smsCode));
  }

  public async changePassword(): Promise<any> {
    return this.operate(() => this.state.changePassword());
  }

  public async save(): Promise<void> {
    await this.repository.save(this);
  }

  private async operate<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } finally {
      await this.save();
    }
  }
}
