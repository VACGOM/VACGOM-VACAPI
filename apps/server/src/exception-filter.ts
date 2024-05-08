import { DomainException } from './exception/domain-exception';
import { JsonRpcExceptionFilter } from './json-rpc/json-rpc.decorator';
import { ExceptionFilter } from './json-rpc/exceptions/exception-filter';
import { JsonRpcDomainException } from '../../../libs/types/src/exceptions/json-rpc-domain-exception';

@JsonRpcExceptionFilter(DomainException)
export class DomainExceptionFilter implements ExceptionFilter<DomainException> {
  catch(exception: DomainException, callback: any) {
    const error: JsonRpcDomainException = {
      code: -100,
      message: exception.errorData.message,
      data: {
        errorData: exception.errorData,
        data: exception.data,
      },
    };
    
    callback(error);
  }
}
