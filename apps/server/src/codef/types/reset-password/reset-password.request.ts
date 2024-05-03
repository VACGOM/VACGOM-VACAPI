import {
  CodefResetPasswordRequest,
  TwoWayResetPasswordRequest,
} from '../../dtos/reset-password/codef-reset-password.request';

export type CodefResetPasswordReQuest =
  | CodefResetPasswordRequest
  | TwoWayResetPasswordRequest;
