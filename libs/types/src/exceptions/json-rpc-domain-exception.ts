import * as t from 'io-ts';

export const JsonRpcDomainException = t.type({
  code: t.number,
  message: t.string,
  data: t.type({
    errorData: t.type({
      code: t.string,
      message: t.string,
      success: t.boolean,
    }),
    data: t.any,
  }),
});

export type JsonRpcDomainException = t.TypeOf<typeof JsonRpcDomainException>;
