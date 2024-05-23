import { DomainException } from '../../../libs/types/src/exceptions/domain-exception';
import { JsonRpcDomainException } from '@vacgom/types';
import { ExceptionFilter, JsonRpcExceptionFilter } from 'nestjs-jayson';

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
