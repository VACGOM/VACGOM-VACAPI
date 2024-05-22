import {
  DynamicModule,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  Type,
} from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { JsonRpcService } from './json-rpc.service';

import { JsonRpcExceptionHandler } from './exceptions';
import { MiddlewareManager } from './middleware-manager';
import { JsonRpcMiddlewareInterface } from './json-rpc-middleware.interface';
import { JsonRpcServerMiddleware } from './middleware';

export type JsonRpcModuleConfiguration = {
  middlewares: {
    methods: string[];
    middleware: Type<JsonRpcMiddlewareInterface>;
  }[];
};

@Module({
  imports: [DiscoveryModule],
  providers: [JsonRpcService, Logger, JsonRpcExceptionHandler],
})
export class JsonRpcModule implements NestModule {
  static forRoot(config: JsonRpcModuleConfiguration): DynamicModule {
    return {
      global: true,
      module: JsonRpcModule,
      providers: [
        JsonRpcService,
        Logger,
        JsonRpcExceptionHandler,
        {
          provide: MiddlewareManager,
          useValue: new MiddlewareManager(config),
        },
      ],
    };
  }

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(JsonRpcServerMiddleware).forRoutes('json-rpc');
  }
}
