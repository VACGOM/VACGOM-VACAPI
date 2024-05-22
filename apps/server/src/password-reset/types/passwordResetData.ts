import * as t from 'io-ts';
import { IdentityType, TelecomType } from '@vacgom/types';

export const PasswordResetData = t.type({
  isRemoved: t.boolean,
  memberId: t.string,
  secureNoImage: t.union([t.string, t.undefined]),
  requestInfo: t.type({
    identity: IdentityType,
    name: t.string,
    newPassword: t.string,
    phoneNumber: t.string,
    telecom: TelecomType,
  }),
  twoWayInfo: t.union([
    t.type({
      jobIndex: t.number,
      jti: t.string,
      threadIndex: t.number,
      twoWayTimestamp: t.number,
    }),
    t.undefined,
  ]),
});

export type PasswordResetData = t.TypeOf<typeof PasswordResetData>;
