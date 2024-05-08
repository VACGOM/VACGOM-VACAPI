import { JsonRpcExceptionFilter } from './json-rpc/json-rpc.decorator';
import { ExceptionFilter } from './json-rpc/exceptions/exception-filter';
import { UnhandledCodefException } from './codef/exceptions/UnhandledCodefException';
import { JSONRPCErrorLike } from 'jayson';

@JsonRpcExceptionFilter(UnhandledCodefException)
export class UnhandledCodefExceptionFilter
  implements ExceptionFilter<UnhandledCodefException<any>>
{
  catch(exception: UnhandledCodefException<any>, callback: any) {
    const error: JSONRPCErrorLike = {
      code: -100,
      message: 'Codef 에러',
    };

    callback(error);
  }
}
