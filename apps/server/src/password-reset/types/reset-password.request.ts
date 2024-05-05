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
