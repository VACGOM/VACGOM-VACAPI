import { DomainException } from './exception/domain-exception';
import { JsonRpcExceptionFilter } from './json-rpc/json-rpc.decorator';
import { ExceptionFilter } from './json-rpc/exceptions/exception-filter';

@JsonRpcExceptionFilter(DomainException)
export class DomainExceptionFilter implements ExceptionFilter<DomainException> {
  catch(exception: DomainException, callback: any) {
    callback({
      code: -100,
      message: exception.errorData.message,
      errorData: exception.errorData,
      data: exception.data,
    });
  }
}
