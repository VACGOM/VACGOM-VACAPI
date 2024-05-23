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
import { ContextRepository, PersistMethod } from '../context/repository';
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

  @PersistMethod
  public async requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    const decoded = ResetPasswordRequest.decode(request);
    if (isLeft(decoded)) {
      throw new ValidationError(decoded.left);
    }

    return this.getState().requestPasswordChange(decoded.right);
  }

  @PersistMethod
  public async requestSecureNoImage(): Promise<any> {
    return this.getState().requestSecureNoImage();
  }

  @PersistMethod
  public async refreshSecureNoImage(): Promise<string> {
    return this.getState().refreshSecureNoImage();
  }

  @PersistMethod
  public async inputSecureNo(request: InputSecureNoRequest): Promise<any> {
    const decoded = InputSecureNoRequest.decode(request);
    if (isLeft(decoded)) {
      throw new ValidationError(decoded.left);
    }

    return this.getState().inputSecureNo(decoded.right.secureNo);
  }

  @PersistMethod
  public async inputSMSCode(
    request: InputSMSCodeRequest
  ): Promise<PasswordChangeSuccessResponse> {
    const decoded = InputSMSCodeRequest.decode(request);
    if (isLeft(decoded)) {
      throw new ValidationError(decoded.left);
    }

    return this.getState().inputSMSCode(decoded.right.smsCode);
  }

  @PersistMethod
  public async changePassword(): Promise<any> {
    return this.getState().changePassword();
  }

  public async save(): Promise<void> {
    await this.repository.save(this);
  }
}
