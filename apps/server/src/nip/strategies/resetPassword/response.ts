export type NipResetPasswordBaseResponse<T> = {
  type: T;
  twoWayInfo: {
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: number;
  };
};

export type NipSecureNoResponse = NipResetPasswordBaseResponse<'SecureNo'> & {
  secureNoImage: string;
};

export type NipSMSResponse = NipResetPasswordBaseResponse<'SMS'>;

export type NipPasswordChangedResponse = {
  type: 'PasswordChanged';
  userId: string;
};

export type NipPasswordChangeFailedResponse = {
  type: 'PasswordChangeFailed';
  userId?: string;
  result: string;
};

export type NipResetPasswordResponse =
  | NipSecureNoResponse
  | NipSMSResponse
  | NipPasswordChangedResponse
  | NipPasswordChangeFailedResponse;
