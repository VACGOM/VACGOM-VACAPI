import { ResetPasswordRequest } from './request';

export interface RequestPasswordResetStrategy<T> {
  requestPasswordReset(request: ResetPasswordRequest): Promise<T>;
}
