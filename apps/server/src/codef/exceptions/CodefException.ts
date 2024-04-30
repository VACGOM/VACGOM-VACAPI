import { CodefResponse } from '../types/common/codef.response';

export class CodefException<T> extends Error {
  constructor(readonly result: CodefResponse<T>) {
    super();

    Object.setPrototypeOf(this, CodefException.prototype);
  }
}
