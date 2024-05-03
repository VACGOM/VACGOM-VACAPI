import { TwoWayInfo } from '../../../password-reset/request';
import {
  ResetPasswordRequest,
  SMSCodeRequest,
} from '../../../nip/strategies/resetPassword/request';

export class CodefResetPasswordRequest {
  organization = '0011';
  authMethod = '0';
  timeout = '170';

  constructor(
    public userName: string,
    public identity: string,
    public userPassword: string,
    public telecom: string,
    public phoneNo: string
  ) {}

  static fromRequest(request: ResetPasswordRequest): CodefResetPasswordRequest {
    return new CodefResetPasswordRequest(
      request.name,
      request.identity.to9DigitIdentity(),
      request.newPassword,
      '0',
      request.phoneNumber
    );
  }
}

export class TwoWayResetPasswordRequest extends CodefResetPasswordRequest {
  is2Way = true;

  constructor(
    userName: string,
    identity: string,
    userPassword: string,
    telecom: string,
    phoneNo: string,
    public twoWayInfo: TwoWayInfo,
    public secureNo: string,
    public secureNoRefresh: string
  ) {
    super(userName, identity, userPassword, telecom, phoneNo);
  }

  static fromRequest(request: SMSCodeRequest): TwoWayResetPasswordRequest {
    return new TwoWayResetPasswordRequest(
      request.name,
      request.identity.to9DigitIdentity(),
      request.newPassword,
      '0',
      request.phoneNumber,
      request.twoWayInfo,
      request.secureNo,
      request.secureNoRefresh
    );
  }
}
