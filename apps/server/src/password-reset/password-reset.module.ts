import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { InitialState } from './states/InitialState';
import { RequestPasswordReset } from './states/RequestPasswordReset';
import { SecureNoState } from './states/SecureNoState';
import { PasswordResetController } from './password-reset.controller';
import { NipModule } from '../nip/nip.module';
import { ContextMapper } from './mapper/mapper';
import { ContextFactory } from './context.factory';
import { RedisContextRepositoryImpl } from './redis-context.repository';
import { SMSState } from './states/SMSState';
import * as jayson from 'jayson';

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
    {
      provide: 'ContextRepository',
      useClass: RedisContextRepositoryImpl,
    },
  ],
})
export class PasswordResetModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const server = new jayson.Server({
      add: function (args, callback) {
        callback(null, args[0] + args[1]);
      },
    });

    consumer.apply(server.middleware()).forRoutes('password-reset');
  }
}
