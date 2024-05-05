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

export type PasswordChangedResponse =
  NipResetPasswordBaseResponse<'PasswordChanged'> & {
    userId: string;
  };

export type NipResetPasswordResponse =
  | NipSecureNoResponse
  | NipSMSResponse
  | PasswordChangedResponse;
