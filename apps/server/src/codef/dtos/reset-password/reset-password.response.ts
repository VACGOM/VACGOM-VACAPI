export class ResetPasswordResponse {
  continue2Way!: boolean;
  method!: string;
  jobIndex!: number;
  threadIndex!: number;
  jti!: string;
  twoWayTimestamp!: string;
  extraInfo!: {
    commSimpleAuth: string;
    reqSMSAuthNo: string;
    reqSecureNo: string;
    reqSecureNoRefresh: string;
  };

  constructor(payload: ResetPasswordResponse) {
    this.continue2Way = payload.continue2Way;
    this.method = payload.method;
    this.jobIndex = payload.jobIndex;
    this.threadIndex = payload.threadIndex;
    this.jti = payload.jti;
    this.twoWayTimestamp = payload.twoWayTimestamp;
    this.extraInfo = {
      commSimpleAuth: payload.extraInfo.commSimpleAuth,
      reqSMSAuthNo: payload.extraInfo.reqSMSAuthNo,
      reqSecureNo: payload.extraInfo.reqSecureNo,
      reqSecureNoRefresh: payload.extraInfo.reqSecureNoRefresh,
    };
  }
}

export class ResetPasswordSuccessResponse {
  resUserId!: string;
  resRegistrationStatus!: string;
  resResultDesc!: string;

  constructor(payload: ResetPasswordSuccessResponse) {
    this.resUserId = payload.resUserId;
    this.resRegistrationStatus = payload.resRegistrationStatus;
    this.resResultDesc = payload.resResultDesc;
  }
}
