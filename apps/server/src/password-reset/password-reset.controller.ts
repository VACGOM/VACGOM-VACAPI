import { ContextFactory } from './context.factory';
import { RedisContextRepositoryImpl } from './redis-context.repository';
import {
  Body,
  JsonRpcController,
  JsonRpcMethod,
  Req,
} from '../json-rpc/json-rpc.decorator';
import { Injectable } from '@nestjs/common';
import {
  InputSecureNoRequest,
  InputSMSCodeRequest,
  ResetPasswordRequest,
} from './types/reset-password.request';
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
    const context = this.factory.createInitialState('형주');
    return context.requestPasswordChange(validation.right);
  }

  @JsonRpcMethod('requestSecureNoImage')
  async requestSecureNoImage(@Req req: Request) {
    const context = await this.repository.findByUserId('형주');
    return context.requestSecureNoImage();
  }

  @JsonRpcMethod('inputSecureNo')
  async inputSecureNo(@Body body: InputSecureNoRequest, @Req req: Request) {
    const context = await this.repository.findByUserId('형주');
    return context.inputSecureNo(body);
  }

  @JsonRpcMethod('inputSMSCode')
  async inputSMSCode(@Body body: InputSMSCodeRequest, @Req req: Request) {
    const context = await this.repository.findByUserId('형주');
    return context.inputSMSCode(body);
  }

  @JsonRpcMethod('changePassword')
  async changePassword(@Req req: Request) {
    const context = await this.repository.findByUserId('형주');
    return context.changePassword();
  }

  @JsonRpcMethod('getCurrentState')
  async currentState(@Req req: Request) {
    const context = await this.repository.findByUserId('형주');
    return context.getCurrentState();
  }
}
