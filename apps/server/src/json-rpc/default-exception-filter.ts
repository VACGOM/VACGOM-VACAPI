import { JsonRpcExceptionFilter } from './json-rpc.decorator';
import { JsonRpcError } from './error';
import { ExceptionFilter } from './exceptions/exception-filter';
import { JSONRPCCallbackType } from 'jayson';

@JsonRpcExceptionFilter(Error)
export class JsonRpcDefaultExceptionFilter implements ExceptionFilter<Error> {
  catch(exception: Error, callback: JSONRPCCallbackType): void {
    if (exception instanceof JsonRpcError) {
      callback(exception);
    } else {
      throw exception;
    }
  }
}
