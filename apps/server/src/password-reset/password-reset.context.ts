import { PasswordResetState, StateType } from './password-reset.state';
import { States } from './types/state';
import { ContextRepository } from './context.repository';
import { isLeft } from 'fp-ts/These';
import { ResetPasswordRequest } from './types/reset-password.request';
import { Context } from './types/context';
import { ContextOutput } from './types/context-output';

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
      console.log(decoded.left);
      throw new Error('Invalid request');
    }

    const right = decoded.right;

    return this.operate(() => this.state.requestPasswordChange(decoded.right));
  }

  public async requestSecureNoImage(): Promise<ContextOutput<any>> {
    return this.operate(() => this.state.requestSecureNoImage());
  }

  public async inputSecureNo(secureNo: string): Promise<ContextOutput<any>> {
    return this.operate(() => this.state.inputSecureNo(secureNo));
  }

  public async inputSMSCode(smsCode: string): Promise<ContextOutput<any>> {
    return this.operate(() => this.state.inputSMSCode(smsCode));
  }

  public async changePassword(): Promise<ContextOutput<any>> {
    return this.operate(() => this.state.changePassword());
  }

  public async save(): Promise<void> {
    await this.repository.save(this);
  }

  private async operate<T>(fn: () => Promise<T>): Promise<ContextOutput<T>> {
    const result = await fn();
    await this.save();

    return {
      success: true,
      state: this.data.stateType,
      data: result,
    };
  }
}
