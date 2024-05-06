import * as t from 'io-ts';
import { CodefResponse } from '../common/codef.response';

export const CodefSecureNoResponse = CodefResponse(
  t.type({
    continue2Way: t.boolean,
    method: t.literal('secureNo'),
    jobIndex: t.number,
    threadIndex: t.number,
    jti: t.string,
    twoWayTimestamp: t.number,
    extraInfo: t.type({
      reqSecureNo: t.string,
      reqSecureNoRefresh: t.string,
    }),
  })
);

export type CodefSecureNoResponse = t.TypeOf<typeof CodefSecureNoResponse>;

export const CodefSMSResponse = CodefResponse(
  t.type({
    continue2Way: t.boolean,
    method: t.literal('smsAuthNo'),
    jobIndex: t.number,
    threadIndex: t.number,
    jti: t.string,
    twoWayTimestamp: t.number,
    extraInfo: t.type({
      reqSMSAuthNo: t.string,
    }),
  })
);
export type CodefSMSResponse = t.TypeOf<typeof CodefSMSResponse>;

export const CodefPasswordChangedResponse = CodefResponse(
  t.type({
    resLoginId: t.string,
    resRegistrationStatus: t.string,
    resResultDesc: t.string,
  })
);

export type CodefPasswordChangedResponse = t.TypeOf<
  typeof CodefPasswordChangedResponse
>;

export const CodefResetPasswordResponse = t.union([
  CodefPasswordChangedResponse,
  CodefSecureNoResponse,
  CodefSMSResponse,
]);

export type CodefResetPasswordResponse = t.TypeOf<
  typeof CodefResetPasswordResponse
>;
