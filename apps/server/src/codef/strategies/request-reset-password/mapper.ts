import { NipResetPasswordRequest } from '../../../nip/strategies/resetPassword/request';
import { CodefResetPasswordResponse } from '../../types/reset-password/reset-password.response';
import { isTwoWay } from '../../types/reset-password/utils';
import { NipResetPasswordResponse } from '../../../nip/strategies/resetPassword/response';
import {
  CodefResetPasswordRequest,
  CodefTwoWayRefreshSecureNoRequest,
  CodefTwoWaySecureNoInputRequest,
  CodefTwoWaySMSInputRequest,
} from '../../types/reset-password/reset-password.request';

export class Mapper {
  toCodefRequest<T extends NipResetPasswordRequest>(request: T) {
    if (request.type == 'RequestResetPassword') {
      const codefRequest: CodefResetPasswordRequest = {
        organization: '0011',
        authMethod: '0',
        timeout: '170',
        userName: request.name,
        identity: request.identity.to9DigitRnnString(),
        userPassword: request.newPassword,
        telecom: request.telecom.getValue().toString(),
        phoneNo: request.phoneNumber,
      };

      return codefRequest;
    } else if (request.type == 'InputSecureNo') {
      const codefRequest: CodefTwoWaySecureNoInputRequest = {
        organization: '0011',
        authMethod: '0',
        timeout: '170',
        userName: request.name,
        identity: request.identity.to9DigitRnnString(),
        userPassword: request.newPassword,
        telecom: request.telecom.getValue().toString(),
        phoneNo: request.phoneNumber,
        twoWayInfo: {
          jobIndex: request.twoWayInfo.jobIndex,
          threadIndex: request.twoWayInfo.threadIndex,
          jti: request.twoWayInfo.jti,
          twoWayTimestamp: request.twoWayInfo.twoWayTimestamp,
        },
        secureNo: request.secureNo,
        secureNoRefresh: '0',
        is2Way: true,
      };

      return codefRequest;
    } else if (request.type == 'InputSMS') {
      const codefRequest: CodefTwoWaySMSInputRequest = {
        organization: '0011',
        authMethod: '0',
        timeout: '170',
        userName: request.name,
        identity: request.identity.to9DigitRnnString(),
        userPassword: request.newPassword,
        telecom: request.telecom.getValue().toString(),
        phoneNo: request.phoneNumber,
        twoWayInfo: {
          jobIndex: request.twoWayInfo.jobIndex,
          threadIndex: request.twoWayInfo.threadIndex,
          jti: request.twoWayInfo.jti,
          twoWayTimestamp: request.twoWayInfo.twoWayTimestamp,
        },
        smsAuthNo: request.smsAuthNo,
        is2Way: true,
      };

      return codefRequest;
    } else if (request.type == 'RefreshSecureNo') {
      const codefRequest: CodefTwoWayRefreshSecureNoRequest = {
        organization: '0011',
        authMethod: '0',
        timeout: '170',
        userName: request.name,
        identity: request.identity.to9DigitRnnString(),
        userPassword: request.newPassword,
        telecom: request.telecom.getValue().toString(),
        phoneNo: request.phoneNumber,
        twoWayInfo: {
          jobIndex: request.twoWayInfo.jobIndex,
          threadIndex: request.twoWayInfo.threadIndex,
          jti: request.twoWayInfo.jti,
          twoWayTimestamp: request.twoWayInfo.twoWayTimestamp,
        },
        secureNoRefresh: '1',
        is2Way: true,
      };

      return codefRequest;
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
      if (response.data.resRegistrationStatus == '0') {
        return {
          type: 'PasswordChangeFailed',
          userId: response.data.resLoginId,
          result: response.data.resResultDesc,
        };
      } else {
        return {
          type: 'PasswordChanged',
          userId: response.data.resLoginId,
        };
      }
    }
  }
}
