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

  buildParam(params: JsonRpcParam[], requestContext: RequestContext) {
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

  registerMethod(
    instance: Record<string, Function>,
    methodName: string,
    handlerName: string
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
      async (params: any, context: RequestContext, callback: any) => {
        try {
          const result = await methodRef.apply(
            instance,
            this.buildParam(jsonRpcParams, {
              req: context.req,
              body: params,
            })
          );

          callback(null, result);
        } catch (error) {
          try {
            this.exceptionHandler.handle(error, callback);
          } catch (e) {
            this.logger.error(e);
            callback({
              code: -32000,
              message: 'Server error',
              data: e,
            });
          }
        }
      }
    );
  }

  registerExceptionFilters() {
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
                `${controllerName}.${methodName}`
              );
              this.logger.log(
                `Registered method ${controllerName}.${methodName}`,
                JsonRpcService.name
              );
            }
          });
      });
  }

  onModuleInit(): any {
    this.registerMethods();
    this.registerExceptionFilters();
  }
}
