export class InvalidTelecomStringException extends Error {
  constructor() {
    super('유효하지 않은 통신사 문자열입니다.');

    Object.setPrototypeOf(this, InvalidTelecomStringException.prototype);
  }
}
