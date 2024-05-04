import * as t from 'io-ts';
import { isLeft } from 'fp-ts/Either';
import { Telecom } from '@vacgom/types';

export const TelecomType = new t.Type<Telecom, string, unknown>(
  'Telecom',
  (u): u is Telecom => u instanceof Telecom,
  (u, c) => {
    const str = t.string.validate(u, c);
    if (isLeft(str)) return t.failure(u, c);

    try {
      return t.success(Telecom.fromString(str.right));
    } catch (e) {
      return t.failure(u, c);
    }
  },
  (u) => u.toString()
);

export type TelecomType = t.TypeOf<typeof TelecomType>;
