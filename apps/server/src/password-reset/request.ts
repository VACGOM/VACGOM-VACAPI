import * as t from 'io-ts';

export const TwoWayInfoType = t.type({
  jobIndex: t.number,
  threadIndex: t.number,
  jti: t.string,
  twoWayTimestamp: t.string,
});

export type TwoWayInfo = t.TypeOf<typeof TwoWayInfoType>;

export const RequestInfoType = <T extends t.Mixed>(dataType: T) => {
  return t.type({
    data: dataType,
    twoWayInfo: TwoWayInfoType,
  });
};

export type RequestInfo<T> = t.TypeOf<
  ReturnType<typeof RequestInfoType<t.Type<T>>>
>;
