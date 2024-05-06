import { Errors } from 'io-ts';

export class ValidationError extends Error {
  constructor(errors: Errors) {
    super('Validation Error');
    this.name = 'ValidationError';

    errors.map((error) => {
      console.log(error.message);
    });
  }
}
