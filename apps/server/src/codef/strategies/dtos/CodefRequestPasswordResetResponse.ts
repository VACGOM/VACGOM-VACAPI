import { ResetPasswordResponse } from '../../dtos/reset-password/reset-password.response';

export class CodefRequestPasswordResetResponse extends ResetPasswordResponse {
  jobIndex!: number;
  threadIndex!: number;
  jti!: string;
  twoWayTimestamp!: string;
  continue2Way!: boolean;
  reqSecureNo: string;
  reqSecureNoRefresh: string;

  method!: string;
}
