import * as t from 'io-ts';

export const TwoWayInfoType = t.type({
  jobIndex: t.number,
  threadIndex: t.number,
  jti: t.string,
  twoWayTimestamp: t.number,
});

export type TwoWayInfo = t.TypeOf<typeof TwoWayInfoType>;

export const RequestInfoType = <T extends t.Mixed>(dataType: T) => {
  return t.type({
    data: t.union([dataType, t.null]),
    twoWayInfo: t.union([TwoWayInfoType, t.null]),
  });
};

export type RequestInfo<T> = t.TypeOf<
  ReturnType<typeof RequestInfoType<t.Type<T>>>
>;
