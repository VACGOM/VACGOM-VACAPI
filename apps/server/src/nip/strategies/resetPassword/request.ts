import { Identity, Telecom } from '@vacgom/types';

export class ResetPasswordRequest {
  name!: string;
  identity!: Identity;
  newPassword!: string;
  telecom!: Telecom;
  phoneNumber!: string;
}

export type TwoWay<T> = {
  isTwoWay: boolean;
  jobIndex: number;
  threadIndex: number;
  jti: string;
  twoWayTimestamp: number;
  data: T;
};

export type SMSCodeRequest = TwoWay<{ secureNo: string }>;
export type SMSCodeResponse = {
  userId: string;
};
export type SecureNoRequest = TwoWay<void>;
export type SecureNoResponse = TwoWay<{ secureNoImage: string }>;
