import { PasswordResetState, StateType } from './password-reset.state';
import { RequestInfo } from './request';
import { ResetPasswordRequest } from '../nip/strategies/resetPassword/request';
import { States } from './types/state';
import { ContextRepository } from './context.repository';

export class PasswordResetContext {
  public stateType!: StateType;

  state: PasswordResetState;

  constructor(
    private states: States,
    private repository: ContextRepository,
    public memberId: string,
    public request: RequestInfo<ResetPasswordRequest>,
    state: StateType,
    public secureNoImage?: string
  ) {
    this.changeState(state);
  }

  public changeState(state: StateType) {
    this.state = this.states[state];
    this.stateType = state;

    this.state.setContext(this);
  }

  public async requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    return this.operate(() => this.state.requestPasswordChange(request));
  }

  public async requestSecureNoImage(): Promise<string> {
    return this.operate(() => this.state.requestSecureNoImage());
  }

  public async inputSecureNo(secureNo: string): Promise<boolean> {
    return this.operate(() => this.state.inputSecureNo(secureNo));
  }

  public async inputSMSCode(smsCode: string): Promise<boolean> {
    return this.operate(() => this.state.inputSMSCode(smsCode));
  }

  public async changePassword(): Promise<ResetPasswordRequest> {
    return this.operate(() => this.state.changePassword());
  }

  public async save(): Promise<void> {
    await this.repository.save(this);
  }

  private async operate<T>(fn: () => Promise<T>): Promise<T> {
    const result = await fn();
    await this.save();

    return result;
  }
}
