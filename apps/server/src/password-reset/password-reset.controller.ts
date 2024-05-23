import { ContextFactory } from './context.factory';
import { RedisContextRepositoryImpl } from './redis-context.repository';

import { Injectable } from '@nestjs/common';
import { isLeft } from 'fp-ts/These';
import { DomainException } from '../../../../libs/types/src/exceptions/domain-exception';
import { ErrorCode } from '../../../../libs/types/src/exceptions/error';
import { AuthenticatedRequest } from './auth.middleware';
import {
  InputSecureNoRequest,
  InputSMSCodeRequest,
  ResetPasswordRequest,
} from '@vacgom/types';
import { Body, JsonRpcController, JsonRpcMethod, Req } from 'nestjs-jayson';

@Injectable()
@JsonRpcController('password-reset', [])
export class PasswordResetController {
  constructor(
    private factory: ContextFactory,
    private repository: RedisContextRepositoryImpl
  ) {}

  @JsonRpcMethod('requestPasswordReset')
  async requestPasswordReset(
    @Body body: ResetPasswordRequest,
    @Req req: AuthenticatedRequest
  ) {
    const validation = ResetPasswordRequest.decode(body);
    if (isLeft(validation))
      throw new DomainException(ErrorCode.VALIDATION_ERROR, validation.left);
    const context = this.factory.createInitialState(req.userId);
    return context.requestPasswordChange(validation.right);
  }

  @JsonRpcMethod('requestSecureNoImage')
  async requestSecureNoImage(@Req req: AuthenticatedRequest) {
    const context = await this.repository.findById(req.userId);
    return context.requestSecureNoImage();
  }

  @JsonRpcMethod('refreshSecureNoImage')
  async refreshSecureNoImage(@Req req: AuthenticatedRequest) {
    const context = await this.repository.findById(req.userId);
    return context.refreshSecureNoImage();
  }

  @JsonRpcMethod('inputSecureNo')
  async inputSecureNo(
    @Body body: InputSecureNoRequest,
    @Req req: AuthenticatedRequest
  ) {
    const context = await this.repository.findById(req.userId);
    return context.inputSecureNo(body);
  }

  @JsonRpcMethod('inputSMSCode')
  async inputSMSCode(
    @Body body: InputSMSCodeRequest,
    @Req req: AuthenticatedRequest
  ) {
    const context = await this.repository.findById(req.userId);
    return context.inputSMSCode(body);
  }

  @JsonRpcMethod('changePassword')
  async changePassword(@Req req: AuthenticatedRequest) {
    const context = await this.repository.findById(req.userId);
    return context.changePassword();
  }

  @JsonRpcMethod('currentState')
  async currentState(@Req req: AuthenticatedRequest) {
    const context = await this.repository.findById(req.userId);
    console.log('currentState', context.getCurrentState());

    return context.getCurrentState();
  }

  @JsonRpcMethod('resetContext')
  async resetContext(@Req req: AuthenticatedRequest) {
    const context = await this.repository.findById(req.userId);
    await context.resetContext();
  }
}
