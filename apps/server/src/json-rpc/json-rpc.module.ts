import {
  DynamicModule,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { JsonRpcService } from './json-rpc.service';
import { LoggerMiddleware } from './middleware';

import { JsonRpcExceptionHandler } from './exceptions/exception-handler';

@Module({
  imports: [DiscoveryModule],
  providers: [JsonRpcService, Logger, JsonRpcExceptionHandler],
})
export class JsonRpcModule implements NestModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: JsonRpcModule,
      providers: [JsonRpcService, Logger, JsonRpcExceptionHandler],
    };
  }

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('json-rpc');
  }
}
