import { Module } from '@nestjs/common';
import { CodefModule } from './codef/codef.module';
import { ConfigModule } from '@nestjs/config';
import { RequestModule } from './request/request.module';
import { IdempotencyModule } from './idempotency/idempotency.module';
import { VaccinationModule } from './vaccination/vaccination.module';
import { NipModule } from './nip/nip.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { JsonRpcModule } from './json-rpc/json-rpc.module';
import { DomainExceptionFilter } from './exception-filter';
import { AuthMiddleware } from './password-reset/auth.middleware';
import { IdempotencyMiddleware } from './idempotency/idempotency.middleware';
import { UnhandledCodefExceptionFilter } from './default-exception-filter';

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
          methods: ['*.*'],
          middleware: AuthMiddleware,
        },
        {
          methods: ['*.*'],
          middleware: IdempotencyMiddleware,
        },
      ],
    }),
  ],
  providers: [DomainExceptionFilter, UnhandledCodefExceptionFilter],
})
export class AppModule {}
