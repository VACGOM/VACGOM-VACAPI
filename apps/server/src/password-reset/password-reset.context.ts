import { PasswordResetState, StateType } from './password-reset.state';
import { States } from './types/state';
import { ContextRepository } from './context.repository';
import { isLeft } from 'fp-ts/These';
import {
  InputSecureNoRequest,
  InputSMSCodeRequest,
  ResetPasswordRequest,
} from './types/reset-password.request';
import { Context } from './types/context';
import { ContextOutput } from './types/context-output';
import { ValidationError } from './exception/ValidationError';

export class PasswordResetContext {
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
  ): Promise<ContextOutput<boolean>> {
    const decoded = ResetPasswordRequest.decode(request);
    if (isLeft(decoded)) {
      throw new ValidationError(decoded.left);
    }

    return this.operate(() => this.state.requestPasswordChange(decoded.right));
  }

  public async requestSecureNoImage(): Promise<ContextOutput<any>> {
    return this.operate(() => this.state.requestSecureNoImage());
  }

  public async inputSecureNo(
    request: InputSecureNoRequest
  ): Promise<ContextOutput<any>> {
    const decoded = InputSecureNoRequest.decode(request);
    if (isLeft(decoded)) {
      throw new ValidationError(decoded.left);
    }

    return this.operate(() => this.state.inputSecureNo(decoded.right.secureNo));
  }

  public async inputSMSCode(
    request: InputSMSCodeRequest
  ): Promise<ContextOutput<any>> {
    const decoded = InputSMSCodeRequest.decode(request);
    if (isLeft(decoded)) {
      throw new ValidationError(decoded.left);
    }

    return this.operate(() => this.state.inputSMSCode(decoded.right.smsCode));
  }

  public async changePassword(): Promise<ContextOutput<any>> {
    return this.operate(() => this.state.changePassword());
  }

  public async save(): Promise<void> {
    await this.repository.save(this);
  }

  private async operate<T>(fn: () => Promise<T>): Promise<ContextOutput<T>> {
    try {
      const result = await fn();

      return {
        success: true,
        state: this.data.stateType,
        data: result,
      };
    } catch (e) {
      return {
        success: false,
        state: this.data.stateType,
        data: e,
      };
    } finally {
      await this.save();
    }
  }
}
