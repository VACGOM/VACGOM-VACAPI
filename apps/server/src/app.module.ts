import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CodefModule } from './codef/codef.module';
import { ConfigModule } from '@nestjs/config';
import { RequestModule } from './request/request.module';
import { IdempotencyModule } from './idempotency/idempotency.module';
import { IdempotencyMiddleware } from './idempotency/idempotency.middleware';
import { VaccinationModule } from './vaccination/vaccination.module';

@Module({
  imports: [
    CodefModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RequestModule,
    IdempotencyModule,
    VaccinationModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdempotencyMiddleware).forRoutes('*');
  }
}
