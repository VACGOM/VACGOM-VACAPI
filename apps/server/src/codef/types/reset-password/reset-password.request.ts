export type CodefResetPasswordRequest = {
  organization: '0011';
  authMethod: '0';
  timeout: '170';
  userName: string;
  identity: string;
  userPassword: string;
  telecom: string;
  phoneNo: string;
};

export type TwoWayInfo = {
  jobIndex: number;
  threadIndex: number;
  jti: string;
  twoWayTimestamp: number;
};

export type CodefTwoWaySecureNoInputRequest = CodefResetPasswordRequest & {
  twoWayInfo: TwoWayInfo;
  secureNo: string;
  secureNoRefresh: string;
  is2Way: true;
};

export type CodefTwoWayRefreshSecureNoRequest = CodefResetPasswordRequest & {
  twoWayInfo: TwoWayInfo;
  secureNoRefresh: string;
  is2Way: true;
};

export type CodefTwoWaySMSInputRequest = CodefResetPasswordRequest & {
  twoWayInfo: TwoWayInfo;
  smsAuthNo: string;
  is2Way: true;
};

export type CodefRequests =
  | CodefResetPasswordRequest
  | CodefTwoWaySecureNoInputRequest;
