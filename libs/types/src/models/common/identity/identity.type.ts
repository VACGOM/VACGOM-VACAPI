import * as t from 'io-ts';
import { isLeft } from 'fp-ts/Either';
import { Identity } from '@vacgom/types';

export const IdentityType = new t.Type<Identity, string, unknown>(
  'Identity',
  (u): u is Identity => u instanceof Identity,
  (u, c) => {
    const str = t.string.validate(u, c);
    if (isLeft(str)) return t.failure(u, c);

    try {
      return t.success(Identity.parse(str.right));
    } catch (e) {
      return t.failure(u, c);
    }
  },
  (u) => u.toString()
);

export type IdentityType = t.TypeOf<typeof IdentityType>;
