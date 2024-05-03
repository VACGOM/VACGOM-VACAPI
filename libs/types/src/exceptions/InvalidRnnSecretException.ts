export class InvalidRnnSecretException extends Error {
  constructor() {
    super('올바르지 않은 주민번호 뒷자리입니다.');
  }
}
