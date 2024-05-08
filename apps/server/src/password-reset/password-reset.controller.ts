import { ContextFactory } from './context.factory';
import { RedisContextRepositoryImpl } from './redis-context.repository';
import {
  Body,
  JsonRpcController,
  JsonRpcMethod,
  Req,
} from '../json-rpc/json-rpc.decorator';
import { Injectable } from '@nestjs/common';
import { isLeft } from 'fp-ts/These';
import { DomainException } from '../exception/domain-exception';
import { ErrorCode } from '../exception/error';
import { AuthenticatedRequest } from './auth.middleware';
import {
  InputSecureNoRequest,
  InputSMSCodeRequest,
  ResetPasswordRequest,
} from '@vacgom/types';

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
    const context = await this.repository.getByUserId(req.userId);
    return context.requestSecureNoImage();
  }

  @JsonRpcMethod('refreshSecureNoImage')
  async refreshSecureNoImage(@Req req: AuthenticatedRequest) {
    const context = await this.repository.getByUserId(req.userId);
    return context.refreshSecureNoImage();
  }

  @JsonRpcMethod('inputSecureNo')
  async inputSecureNo(
    @Body body: InputSecureNoRequest,
    @Req req: AuthenticatedRequest
  ) {
    const context = await this.repository.getByUserId(req.userId);
    return context.inputSecureNo(body);
  }

  @JsonRpcMethod('inputSMSCode')
  async inputSMSCode(
    @Body body: InputSMSCodeRequest,
    @Req req: AuthenticatedRequest
  ) {
    const context = await this.repository.getByUserId(req.userId);
    return context.inputSMSCode(body);
  }

  @JsonRpcMethod('changePassword')
  async changePassword(@Req req: AuthenticatedRequest) {
    const context = await this.repository.getByUserId(req.userId);
    return context.changePassword();
  }

  @JsonRpcMethod('currentState')
  async currentState(@Req req: AuthenticatedRequest) {
    const context = await this.repository.getByUserId(req.userId);
    return context.getCurrentState();
  }
}
