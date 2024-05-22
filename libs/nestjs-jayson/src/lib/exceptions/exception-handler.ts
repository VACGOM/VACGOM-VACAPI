import { Injectable } from '@nestjs/common';
import { ExceptionFilter } from './exception-filter';
import { JSONRPCCallbackType } from 'jayson';

export type JsonRpcExceptionHandlerMap<T extends Error> = {
  [exceptionType: string]: ExceptionFilter<T>;
};

@Injectable()
export class JsonRpcExceptionHandler<T extends Error> {
  private exceptionFilters: JsonRpcExceptionHandlerMap<any> = {};

  constructor() {}

  registerFilter(exception: string, filter: ExceptionFilter<T>): void {
    this.exceptionFilters[exception] = filter;
  }

  handle(exception: T, callback: JSONRPCCallbackType): void {
    const exceptionType = Object.getPrototypeOf(exception).constructor.name;
    const filter = this.exceptionFilters[exceptionType];

    if (!filter) {
      throw exception;
    }

    filter.catch(exception, callback);
  }
}
