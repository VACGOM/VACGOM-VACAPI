import { ContextFactory } from './context.factory';
import { RedisContextRepositoryImpl } from './redis-context.repository';
import { StateType } from './password-reset.state';
import {
  Body,
  JsonRpcController,
  JsonRpcMethod,
  Req,
} from '../json-rpc/json-rpc.decorator';
import { Injectable } from '@nestjs/common';
import { ResetPasswordRequest } from './types/reset-password.request';
import { isLeft } from 'fp-ts/These';
import { DomainException } from '../exception/domain-exception';
import { ErrorCode } from '../exception/error';

@Injectable()
@JsonRpcController('password-reset')
export class PasswordResetController {
  constructor(
    private factory: ContextFactory,
    private repository: RedisContextRepositoryImpl
  ) {}

  @JsonRpcMethod('requestPasswordReset')
  async requestPasswordReset(
    @Body body: ResetPasswordRequest,
    @Req req: Request
  ) {
    const validation = ResetPasswordRequest.decode(body);
    if (isLeft(validation))
      throw new DomainException(ErrorCode.VALIDATION_ERROR, validation.left);

    const context = this.factory.create(StateType.REQUEST_PASSWORD_RESET, {
      stateType: StateType.INITIAL.toString(),
      memberId: '형주',
      requestInfo: null,
      secureNoImage: null,
      twoWayInfo: null,
    });

    return context.requestPasswordChange(validation.right);
  }
}
