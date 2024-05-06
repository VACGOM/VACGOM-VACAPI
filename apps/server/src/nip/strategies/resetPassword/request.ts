import { Identity, Telecom } from '@vacgom/types';

type NipResetPasswordBaseRequest<T> = {
  type: T;
  name: string;
  identity: Identity;
  newPassword: string;
  telecom: Telecom;
  phoneNumber: string;
};

export type TwoWayRequest = {
  twoWayInfo: {
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: number;
  };
};

export type NipRequestResetPasswordRequest =
  NipResetPasswordBaseRequest<'RequestResetPassword'>;

export type NipInputSecureNoRequest = {
  secureNo: string;
  secureNoRefresh: '0';
} & NipResetPasswordBaseRequest<'InputSecureNo'> &
  TwoWayRequest;

export type NipRefreshSecureNoRequest = {
  secureNoRefresh: '1';
} & NipResetPasswordBaseRequest<'RefreshSecureNo'> &
  TwoWayRequest;

export type NipInputSMSRequest = {
  smsAuthNo: string;
} & NipResetPasswordBaseRequest<'InputSMS'> &
  TwoWayRequest;

export type NipResetPasswordRequest =
  | NipRequestResetPasswordRequest
  | NipRefreshSecureNoRequest
  | NipInputSecureNoRequest
  | NipInputSMSRequest;
