import * as t from 'io-ts';
import { IdentityType, TelecomType } from '@vacgom/types';

export const Context = t.type({
  memberId: t.string,
  stateType: t.string,
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

export type Context = t.TypeOf<typeof Context>;
