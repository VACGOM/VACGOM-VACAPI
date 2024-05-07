import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import * as jayson from 'jayson';
import {
  JSON_RPC_CONTROLLER,
  JSON_RPC_EXCEPTION_FILTER,
  JSON_RPC_METHOD,
  JSON_RPC_PARAMS,
  JsonRpcParam,
  JsonRpcParamsMetadata,
  RequestContext,
} from './json-rpc.decorator';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { ExceptionFilter } from './exceptions/exception-filter';
import { JsonRpcExceptionHandler } from './exceptions/exception-handler';
import { JsonRpcMiddlewareInterface } from './json-rpc-middleware.interface';
import { AuthMiddleware } from '../password-reset/auth.middleware';

@Injectable()
export class JsonRpcService implements OnModuleInit {
  private server = jayson.Server({}, { useContext: true });

  constructor(
    private metadataScanner: MetadataScanner,
    private discoveryService: DiscoveryService,
    private exceptionHandler: JsonRpcExceptionHandler<any>,
    private reflector: Reflector,
    private logger: Logger
  ) {}

  public getServer(): jayson.Server {
    return this.server;
  }

  registerMethods() {
    this.discoveryService
      .getProviders()
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter((wrapper) => wrapper.instance)
      .forEach((provider: InstanceWrapper) => {
        const { instance } = provider;

        const controllerName: string | undefined = Reflect.getOwnMetadata(
          JSON_RPC_CONTROLLER,
          instance.constructor
        );

        if (!controllerName) {
          return;
        }

        this.metadataScanner
          .getAllMethodNames(instance)
          .forEach((methodName) => {
            const method = instance[methodName];
            const metadata = this.reflector.get(JSON_RPC_METHOD, method);

            if (metadata) {
              this.registerMethod(
                instance,
                methodName,
                `${controllerName}.${methodName}`,
                [new AuthMiddleware()]
              );
              this.logger.log(
                `Registered method ${controllerName}.${methodName}`,
                JsonRpcService.name
              );
            }
          });
      });
  }

  public onModuleInit(): any {
    this.registerMethods();
    this.registerExceptionFilters();
  }

  private registerMethod(
    instance: Record<string, Function>,
    methodName: string,
    handlerName: string,
    middlewares: JsonRpcMiddlewareInterface[]
  ) {
    const methodRef = instance[methodName];

    const paramsMetadata: JsonRpcParamsMetadata = this.reflector.get(
      JSON_RPC_PARAMS,
      instance.constructor
    );

    const jsonRpcParams = paramsMetadata.params.filter(
      (param) => param.key === methodName
    );

    this.server.method(
      handlerName,
      this.createHandler(methodRef, instance, jsonRpcParams, middlewares)
    );
  }

  private buildParam(params: JsonRpcParam[], requestContext: RequestContext) {
    const args = [];

    params.forEach((param) => {
      if (param.type === 'REQ') {
        args[param.index] = requestContext.req;
      } else if (param.type === 'BODY') {
        args[param.index] = requestContext.body;
      }
    });

    return args;
  }

  private registerExceptionFilters() {
    this.discoveryService
      .getProviders()
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter((wrapper) => wrapper.instance)
      .forEach((provider: InstanceWrapper) => {
        const { instance } = provider;

        const exception: Error | undefined = Reflect.getOwnMetadata(
          JSON_RPC_EXCEPTION_FILTER,
          instance.constructor
        );

        if (!exception) {
          return;
        }

        const exceptionFilter = instance as ExceptionFilter<any>;
        this.exceptionHandler.registerFilter(exception.name, exceptionFilter);
        this.logger.log(
          `Registered exception filter ${exception.name}`,
          JsonRpcService.name
        );
      });
  }

  private createHandler(
    methodRef: Function,
    instance: any,
    jsonRpcParams: JsonRpcParam[],
    middlewares: JsonRpcMiddlewareInterface[]
  ) {
    return async (params: any, context: RequestContext, callback: any) => {
      let ms = middlewares.slice();

      await new Promise((resolve) => {
        const next1 = () => {
          if (ms.length > 0) {
            const middleware = ms.shift();
            const promise = middleware.use(context.req, callback, next1);
            if (promise instanceof Promise) {
              promise.catch((err) => {
                this.exceptionHandler.handle(err, callback);
              });
            }
          } else {
            resolve(true);
          }
        };

        next1();
      }).catch((err) => {
        console.log('ERR');
        this.exceptionHandler.handle(err, callback);
      });

      const result = methodRef.apply(
        instance,
        this.buildParam(jsonRpcParams, {
          req: context.req,
          body: params,
        })
      );

      if (result instanceof Promise) {
        result
          .then((res) => callback(null, res))
          .catch((err) => this.exceptionHandler.handle(err, callback));
      } else {
        callback(null, result);
      }
    };
  }
}
