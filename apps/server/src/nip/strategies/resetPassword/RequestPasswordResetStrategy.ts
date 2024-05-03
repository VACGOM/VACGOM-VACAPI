import { ResetPasswordRequest, SMSCodeRequest } from './request';
import { SecureNoResponse } from './response';

export interface RequestPasswordResetStrategy {
  requestPasswordReset(
    request: ResetPasswordRequest | SMSCodeRequest
  ): Promise<SecureNoResponse>;

  requestSecureNo(request: SecureNoResponse): Promise<SecureNoResponse>;

  requestSMSCode(request: SMSCodeRequest): Promise<ResetPasswordRequest>;
}

export const RequestPasswordResetStrategy = Symbol(
  'RequestPasswordResetStrategy'
);
