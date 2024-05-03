export class CodefResetPasswordRequest {
  organization = '0011';
  authMethod = '0';
  userName!: string;
  identity!: string;
  userPassword!: string;
  telecom!: string;
  phoneNo!: string;
  timeout!: string;
}

export class TwoWayResetPasswordRequest extends CodefResetPasswordRequest {
  is2Way = true;
  twoWayInfo!: {
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: string;
  };
}

export class SecureNoTwoWayResetPasswordRequest extends TwoWayResetPasswordRequest {
  secureNo!: string;
  secureNoRefresh!: string;
}

export class SMSTwoWayResetPasswordRequest extends TwoWayResetPasswordRequest {
  smsAuthNo!: string;
}
