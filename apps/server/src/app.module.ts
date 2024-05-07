import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CodefModule } from './codef/codef.module';
import { ConfigModule } from '@nestjs/config';
import { RequestModule } from './request/request.module';
import { IdempotencyModule } from './idempotency/idempotency.module';
import { IdempotencyMiddleware } from './idempotency/idempotency.middleware';
import { VaccinationModule } from './vaccination/vaccination.module';
import { NipModule } from './nip/nip.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { JsonRpcModule } from './json-rpc/json-rpc.module';
import { DomainExceptionFilter } from './exception-filter';
import { AuthMiddleware } from './password-reset/auth.middleware';

@Module({
  imports: [
    CodefModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RequestModule,
    IdempotencyModule,
    VaccinationModule,
    NipModule,
    PasswordResetModule,
    JsonRpcModule.forRoot({
      middlewares: [
        {
          methods: ['password-reset.requestPasswordReset'],
          middleware: AuthMiddleware,
        },
      ],
    }),
  ],
  providers: [DomainExceptionFilter],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdempotencyMiddleware).forRoutes('*');
  }
}
