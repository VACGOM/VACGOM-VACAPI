import { Module } from '@nestjs/common';
import { IdempotencyService } from './idempotency.service';
import { IdempotencyMiddleware } from './idempotency.middleware';
import { IdempotencyController } from './idempotency.controller';

@Module({
  providers: [IdempotencyService, IdempotencyMiddleware],
  exports: [IdempotencyMiddleware, IdempotencyService],
  controllers: [IdempotencyController],
})
export class IdempotencyModule {}
