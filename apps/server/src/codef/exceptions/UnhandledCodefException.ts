import { CodefResponse } from '../types/common/codef.response';

export class UnhandledCodefException<T> extends Error {
  constructor(readonly result: CodefResponse<T>) {
    super();

    Object.setPrototypeOf(this, UnhandledCodefException.prototype);
  }
}
