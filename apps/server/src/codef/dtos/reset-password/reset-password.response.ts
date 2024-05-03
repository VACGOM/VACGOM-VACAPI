export type CodefResetPassword2WayResponseType = {
  continue2Way: boolean;
  method: string;
  jobIndex: number;
  threadIndex: number;
  jti: string;
  twoWayTimestamp: string;
  extraInfo: {
    commSimpleAuth?: string;
    reqSMSAuthNo?: string;
    reqSecureNo?: string;
    reqSecureNoRefresh?: string;
  };
};

export class CodefResetPassword2WayResponse {
  continue2Way!: boolean;
  method!: string;
  jobIndex!: number;
  threadIndex!: number;
  jti!: string;
  twoWayTimestamp!: string;

  constructor(payload: CodefResetPassword2WayResponseType) {
    this.continue2Way = payload.continue2Way;
    this.method = payload.method;
    this.jobIndex = payload.jobIndex;
    this.threadIndex = payload.threadIndex;
    this.jti = payload.jti;
    this.twoWayTimestamp = payload.twoWayTimestamp;
  }
}

export class CodefResetPasswordSecureNo2WayResponse extends CodefResetPassword2WayResponse {
  extraInfo!: {
    reqSecureNo: string;
  };

  constructor(payload: CodefResetPassword2WayResponseType) {
    super(payload);
    this.extraInfo = {
      reqSecureNo: payload.extraInfo.reqSecureNo,
    };
  }
}

export class CodefResetPasswordSMSAuthNo2WayResponse extends CodefResetPassword2WayResponse {
  constructor(payload: CodefResetPassword2WayResponseType) {
    super(payload);
  }
}

export class CodefResetPasswordSuccessResponse {
  resUserId!: string;
  resRegistrationStatus!: string;
  resResultDesc!: string;

  constructor(payload: CodefResetPasswordSuccessResponse) {
    this.resUserId = payload.resUserId;
    this.resRegistrationStatus = payload.resRegistrationStatus;
    this.resResultDesc = payload.resResultDesc;
  }
}
