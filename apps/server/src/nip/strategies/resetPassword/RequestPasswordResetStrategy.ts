import { NipResetPasswordRequest } from './request';
import { NipResetPasswordResponse } from './response';

export interface RequestPasswordResetStrategy {
  requestPasswordReset(
    request: NipResetPasswordRequest
  ): Promise<NipResetPasswordResponse>;
}

export const RequestPasswordResetStrategy = Symbol(
  'RequestPasswordResetStrategy'
);
