import {
  ResetPasswordRequest,
  SecureNoRequest,
  SecureNoResponse,
  SMSCodeRequest,
} from './request';

export interface RequestPasswordResetStrategy {
  requestPasswordReset(
    request: ResetPasswordRequest
  ): Promise<SecureNoResponse>;

  requestSecureNo(request: SecureNoRequest): Promise<SecureNoResponse>;

  requestSMSCode(request: SMSCodeRequest): Promise<ResetPasswordRequest>;
}

export const RequestPasswordResetStrategy = Symbol(
  'RequestPasswordResetStrategy'
);
