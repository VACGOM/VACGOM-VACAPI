import { PasswordResetState } from './password-reset.state';
import { isLeft } from 'fp-ts/These';
import { ValidationError } from './exception/ValidationError';
import {
  InputSecureNoRequest,
  InputSMSCodeRequest,
  PasswordChangeSuccessResponse,
  ResetPasswordRequest,
} from '@vacgom/types';
import { Context, StateKeys } from '../context/context';
import { PasswordResetData } from './types/passwordResetData';
import { ContextRepository } from '../context/repository';
import { Data } from '../context/data';

export const enum PasswordResetStateType {
  INITIAL = 'INITIAL',
  SMS = 'SMS',
  SECURE_NO = 'SECURE_NO',
  REQUEST_PASSWORD_RESET = 'REQUEST_PASSWORD_RESET',
}

export type PasswordResetStateKeys = StateKeys<
  [
    PasswordResetStateType.INITIAL,
    PasswordResetStateType.SMS,
    PasswordResetStateType.SECURE_NO,
    PasswordResetStateType.REQUEST_PASSWORD_RESET
  ]
>;

export class PasswordResetContext extends Context<
  PasswordResetData,
  PasswordResetState,
  PasswordResetStateKeys
> {
  constructor(
    states: Map<PasswordResetStateKeys, PasswordResetState>,
    repository: ContextRepository<PasswordResetContext>,
    data: Data<PasswordResetState, PasswordResetData>
  ) {
    super(states, repository, data);
  }

  public async resetContext(): Promise<void> {
    this.changeState(PasswordResetStateType.INITIAL);
    this.data.payload.isRemoved = true;
    await this.repository.deleteById(this.data.payload.memberId);
  }

  public getCurrentState(): string {
    return this.data.state.getStateType();
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

  public async refreshSecureNoImage(): Promise<string> {
    return this.operate(() => this.state.refreshSecureNoImage());
  }

  public async inputSecureNo(request: InputSecureNoRequest): Promise<any> {
    const decoded = InputSecureNoRequest.decode(request);
    if (isLeft(decoded)) {
      throw new ValidationError(decoded.left);
    }

    return this.operate(() => this.state.inputSecureNo(decoded.right.secureNo));
  }

  public async inputSMSCode(
    request: InputSMSCodeRequest
  ): Promise<PasswordChangeSuccessResponse> {
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
      if (!this.data.payload.isRemoved) await this.save();
    }
  }
}
