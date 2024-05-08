import * as t from 'io-ts';
import { IdentityType, TelecomType } from '@vacgom/types';

export const ResetPasswordRequest = t.type({
  name: t.string,
  identity: IdentityType,
  newPassword: t.string,
  telecom: TelecomType,
  phoneNumber: t.string,
});

export type ResetPasswordRequest = t.TypeOf<typeof ResetPasswordRequest>;

export const InputSecureNoRequest = t.type({
  secureNo: t.string,
});
export type InputSecureNoRequest = t.TypeOf<typeof InputSecureNoRequest>;

export const InputSMSCodeRequest = t.type({
  smsCode: t.string,
});
export type InputSMSCodeRequest = t.TypeOf<typeof InputSMSCodeRequest>;

export const PasswordChangeSuccessResponse = t.type({
  userId: t.string,
});

export type PasswordChangeSuccessResponse = t.TypeOf<
  typeof PasswordChangeSuccessResponse
>;
