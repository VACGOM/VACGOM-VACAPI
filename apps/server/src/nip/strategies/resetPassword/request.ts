import { Identity, Telecom } from '@vacgom/types';

export class ResetPasswordRequest {
  constructor(
    public name: string,
    public identity: Identity,
    public newPassword: string,
    public telecom: Telecom,
    public phoneNumber: string
  ) {}
}

export class SMSCodeRequest extends ResetPasswordRequest {
  constructor(
    name: string,
    identity: Identity,
    newPassword: string,
    telecom: Telecom,
    phoneNumber: string,
    public secureNo: string,
    public secureNoRefresh: string,
    public twoWayInfo: TwoWayInfo
  ) {
    super(name, identity, newPassword, telecom, phoneNumber);
  }
}

export type TwoWayInfo = {
  jobIndex: number;
  threadIndex: number;
  jti: string;
  twoWayTimestamp: string;
};
