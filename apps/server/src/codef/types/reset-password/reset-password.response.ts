import {
  CodefResetPasswordSecureNo2WayResponse,
  CodefResetPasswordSMSAuthNo2WayResponse,
  CodefResetPasswordSuccessResponse,
} from '../../dtos/reset-password/reset-password.response';

export type CodefResetPasswordResponse =
  | CodefResetPasswordSecureNo2WayResponse
  | CodefResetPasswordSMSAuthNo2WayResponse
  | CodefResetPasswordSuccessResponse;
