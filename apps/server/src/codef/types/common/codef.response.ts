import * as t from 'io-ts';

export const CodefResponse = <C extends t.Mixed>(c: C) =>
  t.type({
    result: t.type({
      code: t.string,
      extraMessage: t.string,
      message: t.string,
      transactionId: t.string,
    }),
    data: c,
  });

export type CodefResponse<C> = {
  result: {
    code: string;
    extraMessage: string;
    message: string;
    transactionId: string;
  };
  data: C;
};
