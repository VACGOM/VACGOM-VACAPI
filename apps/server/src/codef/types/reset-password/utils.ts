import {
  NipInputSecureNoRequest,
  NipRequestResetPasswordRequest,
} from '../../../nip/strategies/resetPassword/request';
import {
  CodefResetPasswordRequest,
  CodefTwoWaySecureNoInputRequest,
} from './reset-password.request';
import {
  CodefResetPasswordResponse,
  CodefSecureNoResponse,
  CodefSMSResponse,
} from './reset-password.response';

export type CodefRequestOf<T> = T extends NipRequestResetPasswordRequest
  ? CodefResetPasswordRequest
  : T extends NipInputSecureNoRequest
  ? CodefTwoWaySecureNoInputRequest
  : never;

export function isTwoWay(
  request: CodefResetPasswordResponse
): request is CodefSMSResponse | CodefSecureNoResponse {
  return request.data['continue2Way'];
}
