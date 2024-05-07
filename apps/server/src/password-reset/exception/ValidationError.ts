import { Errors } from 'io-ts';
import { DomainException } from '../../exception/domain-exception';
import { ErrorCode } from '../../exception/error';

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
