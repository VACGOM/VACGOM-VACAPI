import { Injectable, Type } from '@nestjs/common';
import { JsonRpcModuleConfiguration } from './json-rpc.module';
import { JsonRpcMiddlewareInterface } from './json-rpc-middleware.interface';

export type MiddlewareData = {
  [method: string]: Type<JsonRpcMiddlewareInterface>[];
};

@Injectable()
export class MiddlewareManager {
  private middlewares: MiddlewareData = {};

  constructor(private moduleConfiguration: JsonRpcModuleConfiguration) {
    moduleConfiguration.middlewares.forEach((middleware) => {
      this.addMiddleware(middleware.methods, middleware.middleware);
    });
  }

  public addMiddleware(
    methods: string[],
    middleware: Type<JsonRpcMiddlewareInterface>
  ) {
    methods.forEach((method) => {
      if (!this.middlewares[method]) {
        this.middlewares[method] = [];
      }

      this.middlewares[method].push(middleware);
    });
  }

  public getMiddlewares(method: string): Type<JsonRpcMiddlewareInterface>[] {
    const [controller, methodName] = method.split('.');
    if (!controller || !methodName) {
      return [];
    }

    return [method, `*.${methodName}`, `${controller}.*`, '*.*'].flatMap(
      (pattern) => this.middlewares[pattern] || []
    );
  }
}
