import { Injectable, Type } from '@nestjs/common';
import { JsonRpcModuleConfiguration } from './json-rpc.module';
import { JsonRpcMiddlewareInterface } from './json-rpc-middleware.interface';

@Injectable()
export class MiddlewareManager {
  private middlewares: Type<JsonRpcMiddlewareInterface>[] = [];

  constructor(private moduleConfiguration: JsonRpcModuleConfiguration) {
    this.middlewares = moduleConfiguration.middlewares.map(
      (middleware) => middleware.middleware
    );
  }

  public addMiddleware(middleware: any) {
    this.middlewares.push(middleware);
  }

  public getMiddlewares() {
    return this.middlewares;
  }
}
