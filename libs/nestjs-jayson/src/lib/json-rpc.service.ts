import { Injectable, Logger, OnModuleInit, Type } from '@nestjs/common';
import {
  DiscoveryService,
  MetadataScanner,
  ModuleRef,
  Reflector,
} from '@nestjs/core';
import * as jayson from 'jayson';
import {
  JSON_RPC_CONTROLLER,
  JSON_RPC_EXCEPTION_FILTER,
  JSON_RPC_METHOD,
  JSON_RPC_MIDDLEWARE,
  JSON_RPC_PARAMS,
  JsonRpcParam,
  JsonRpcParamsMetadata,
  RequestContext,
} from './json-rpc.decorator';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { ExceptionFilter, JsonRpcExceptionHandler } from './exceptions';
import { JsonRpcMiddlewareInterface } from './json-rpc-middleware.interface';
import { MiddlewareManager } from './middleware-manager';

@Injectable()
export class JsonRpcService implements OnModuleInit {
  private server = jayson.Server({}, { useContext: true });

  constructor(
    private metadataScanner: MetadataScanner,
    private discoveryService: DiscoveryService,
    private exceptionHandler: JsonRpcExceptionHandler<any>,
    private reflector: Reflector,
    private logger: Logger,
    private middlewareManager: MiddlewareManager,
    private moduleRef: ModuleRef
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
                []
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
      this.createHandler(handlerName, methodRef, instance, jsonRpcParams)
    );
  }

  private buildParam(params: JsonRpcParam[], requestContext: RequestContext) {
    const args: any[] = [];

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
    handlerName: string,
    methodRef: Function,
    instance: any,
    jsonRpcParams: JsonRpcParam[]
  ) {
    return async (params: any, context: RequestContext, callback: any) => {
      let ms = this.middlewareManager.getMiddlewares(handlerName);

      await new Promise((resolve) => {
        const next = () => {
          if (ms.length > 0) {
            const middleware = ms.pop();
            if (!middleware) return resolve(true);

            const instance = this.getMiddlewareInstance(middleware);

            const promise = instance.use(context.req, callback, next);
            if (promise instanceof Promise) {
              promise.catch((err) => {
                this.exceptionHandler.handle(err, callback);
              });
            }
          } else {
            resolve(true);
          }
        };

        next();
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

  private getMiddlewareInstance(
    middleware: Type<JsonRpcMiddlewareInterface>
  ): JsonRpcMiddlewareInterface {
    const instances = this.discoveryService
      .getProviders()
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter((wrapper) => wrapper.instance)
      .filter((provider: InstanceWrapper) => {
        const { instance } = provider;
        return Reflect.getOwnMetadata(
          JSON_RPC_MIDDLEWARE,
          instance.constructor
        );
      })
      .filter((provider: InstanceWrapper) => {
        const { instance } = provider;
        return instance.constructor.name == middleware.name;
      });

    return instances[0].instance;
  }
}
