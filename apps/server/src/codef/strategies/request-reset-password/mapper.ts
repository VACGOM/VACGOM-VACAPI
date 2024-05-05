import { NipResetPasswordRequest } from '../../../nip/strategies/resetPassword/request';
import { CodefResetPasswordResponse } from '../../types/reset-password/reset-password.response';
import { CodefRequestOf, isTwoWay } from '../../types/reset-password/utils';
import { NipResetPasswordResponse } from '../../../nip/strategies/resetPassword/response';

export class Mapper {
  toCodefRequest<T extends NipResetPasswordRequest>(
    request: T
  ): CodefRequestOf<T> {
    if (request.type == 'RequestResetPassword') {
      return {
        organization: '0011',
        authMethod: '0',
        timeout: '170',
        userName: request.name,
        identity: request.identity.to9DigitRnnString(),
        userPassword: request.newPassword,
        telecom: request.telecom.getValue().toString(),
        phoneNo: request.phoneNumber,
      } as CodefRequestOf<T>;
    } else if (request.type == 'InputSecureNo') {
      return {
        organization: '0011',
        authMethod: '0',
        timeout: '170',
        userName: request.name,
        identity: request.identity.to9DigitRnnString(),
        userPassword: request.newPassword,
        telecom: request.telecom.toString(),
        phoneNo: request.phoneNumber,
        twoWayInfo: {
          jobIndex: request.twoWayInfo.jobIndex,
          threadIndex: request.twoWayInfo.threadIndex,
          jti: request.twoWayInfo.jti,
          twoWayTimestamp: request.twoWayInfo.twoWayTimestamp,
        },
        secureNo: request.secureNo,
        secureNoRefresh: '0',
      } as CodefRequestOf<T>;
    }
  }

  toNipResponse<T extends CodefResetPasswordResponse>(
    response: T
  ): NipResetPasswordResponse {
    console.log(response);
    if (isTwoWay(response)) {
      if (response.data.method === 'secureNo') {
        return {
          type: 'SecureNo',
          secureNoImage: response.data.extraInfo.reqSecureNo,
          twoWayInfo: {
            jobIndex: response.data.jobIndex,
            threadIndex: response.data.threadIndex,
            jti: response.data.jti,
            twoWayTimestamp: response.data.twoWayTimestamp,
          },
        };
      } else if (response.data.method === 'smsAuthNo') {
        return {
          type: 'SMS',
          twoWayInfo: {
            jobIndex: response.data.jobIndex,
            threadIndex: response.data.threadIndex,
            jti: response.data.jti,
            twoWayTimestamp: response.data.twoWayTimestamp,
          },
        };
      }
    } else {
      throw new Error();
    }
  }
}
