import * as t from 'io-ts';

export class ContextOutput<T> implements ContextOutputType<T> {
  constructor(public success: boolean, public state: string, public data: T) {}

  static success<T>(state: any, data: T): ContextOutput<T> {
    return new ContextOutput(true, state, data);
  }

  static failure<T>(state: any, data: T): ContextOutput<T> {
    return new ContextOutput(false, state, data);
  }
}

export const ContextOutputType = <C extends t.Mixed>(c: C) => {
  return t.type({
    success: t.boolean,
    state: t.string,
    data: c,
  });
};

export type ContextOutputType<T> = t.TypeOf<
  ReturnType<typeof ContextOutputType<t.Type<T>>>
>;
