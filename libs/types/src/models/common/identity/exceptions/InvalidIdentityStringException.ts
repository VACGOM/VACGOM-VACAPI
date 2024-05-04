import { IdentityException } from './IdentityException';

export class InvalidIdentityStringException extends IdentityException {
  constructor() {
    super('유효하지 않은 Identity 문자열입니다.');

    Object.setPrototypeOf(this, InvalidIdentityStringException.prototype);
  }
}
