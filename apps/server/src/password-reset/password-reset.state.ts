import { DomainException } from '../exception/domain-exception';
import { ErrorCode } from '../exception/error';
import {
  PasswordChangeSuccessResponse,
  ResetPasswordRequest,
} from '@vacgom/types';
import { State } from '../context/state';
import {
  PasswordResetContext,
  PasswordResetStateKeys,
} from './password-reset.context';

export abstract class PasswordResetState
  implements State<PasswordResetContext, PasswordResetStateKeys>
{
  protected context?: PasswordResetContext;

  public requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    throw new DomainException(ErrorCode.UNSUPPORTED_OPERATION);
  }

  public requestSecureNoImage(): Promise<string> {
    throw new DomainException(ErrorCode.UNSUPPORTED_OPERATION);
  }

  public inputSecureNo(secureNo: string): Promise<boolean> {
    throw new DomainException(ErrorCode.UNSUPPORTED_OPERATION);
  }

  public refreshSecureNoImage(): Promise<string> {
    throw new DomainException(ErrorCode.UNSUPPORTED_OPERATION);
  }

  public changePassword(): Promise<ResetPasswordRequest> {
    throw new DomainException(ErrorCode.UNSUPPORTED_OPERATION);
  }

  public requestSMSCode(): Promise<boolean> {
    throw new DomainException(ErrorCode.UNSUPPORTED_OPERATION);
  }

  public inputSMSCode(smsCode: string): Promise<PasswordChangeSuccessResponse> {
    throw new DomainException(ErrorCode.UNSUPPORTED_OPERATION);
  }

  public setContext(context: PasswordResetContext) {
    this.context = context;
  }

  abstract getStateType(): PasswordResetStateKeys;
}
