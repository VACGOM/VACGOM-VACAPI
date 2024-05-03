import { ResetPasswordRequest, SMSCodeRequest } from './request';
import { SecureNoResponse, SMSResponse } from './response';

export interface RequestPasswordResetStrategy {
  requestPasswordReset(
    request: ResetPasswordRequest | SMSCodeRequest
  ): Promise<SecureNoResponse | SMSResponse>;
}

export const RequestPasswordResetStrategy = Symbol(
  'RequestPasswordResetStrategy'
);
