import { Module } from '@nestjs/common';
import { InitialState } from './states/InitialState';
import { RequestPasswordReset } from './states/RequestPasswordReset';
import { SecureNoState } from './states/SecureNoState';
import { PasswordResetController } from './password-reset.controller';
import { NipModule } from '../nip/nip.module';
import { ContextMapper } from './mapper/mapper';
import { ContextFactory } from './context.factory';
import { RedisContextRepositoryImpl } from './redis-context.repository';
import { SMSState } from './states/SMSState';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [NipModule],
  controllers: [],
  exports: [],
  providers: [
    ContextMapper,
    InitialState,
    RequestPasswordReset,
    SecureNoState,
    RedisContextRepositoryImpl,
    ContextFactory,
    SMSState,
    PasswordResetController,
    AuthMiddleware,
    {
      provide: 'ContextRepository',
      useClass: RedisContextRepositoryImpl,
    },
  ],
})
export class PasswordResetModule {}
