import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { DomainException } from './exception/domain-exception';
import { Request, Response } from 'express';
import { ErrorResponse } from './common/error-response';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response
      .status(400)
      .json(ErrorResponse.of(exception.errorData, exception.errorData.message));
  }
}
