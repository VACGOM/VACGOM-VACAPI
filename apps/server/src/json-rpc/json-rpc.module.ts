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
import { JsonRpcDefaultExceptionFilter } from './default-exception-filter';
import { JsonRpcExceptionHandler } from './exceptions/exception-handler';

@Module({
  imports: [DiscoveryModule],
  providers: [
    JsonRpcService,
    Logger,
    JsonRpcDefaultExceptionFilter,
    JsonRpcExceptionHandler,
  ],
})
export class JsonRpcModule implements NestModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: JsonRpcModule,
      providers: [
        JsonRpcService,
        Logger,
        JsonRpcDefaultExceptionFilter,
        JsonRpcExceptionHandler,
      ],
    };
  }

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('json-rpc');
  }
}
