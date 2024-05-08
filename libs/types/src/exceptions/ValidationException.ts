export class ValidationException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}
