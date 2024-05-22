import {
  InputSecureNoRequest,
  InputSMSCodeRequest,
  ResetPasswordRequest,
} from '@vacgom/types';

export type PasswordResetContextActions = {
  getCurrentState(): string;
  requestPasswordChange(request: ResetPasswordRequest): Promise<boolean>;
  requestSecureNoImage(): Promise<any>;
  inputSecureNo(request: InputSecureNoRequest): Promise<any>;
  inputSMSCode(request: InputSMSCodeRequest): Promise<any>;
  changePassword(): Promise<any>;
};
