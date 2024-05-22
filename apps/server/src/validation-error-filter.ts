import { JSONRPCErrorLike } from 'jayson';
import { ValidationError } from './password-reset/exception/ValidationError';
import { ExceptionFilter, JsonRpcExceptionFilter } from 'nestjs-jayson';

@JsonRpcExceptionFilter(ValidationError)
export class ValidationErrorFilter implements ExceptionFilter<ValidationError> {
  catch(exception: ValidationError, callback: any) {
    const error: JSONRPCErrorLike = {
      code: -100,
      message: '요청을 확인하세요.',
    };

    callback(error);
  }
}
