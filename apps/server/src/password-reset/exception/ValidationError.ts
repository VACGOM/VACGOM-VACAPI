import { Errors } from 'io-ts';
import { DomainException, ErrorCode } from '@vacgom/types';

export class ValidationError extends DomainException {
  constructor(errors: Errors) {
    const message = errors.flatMap((e) => {
      return e.context.map((c) => c.key).filter((k) => k);
    });

    super(ErrorCode.VALIDATION_ERROR, {
      message: 'Validation error',
      errorData: message,
    });
  }
}
