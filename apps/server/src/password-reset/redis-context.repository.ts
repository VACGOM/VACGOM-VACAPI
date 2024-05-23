import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as process from 'node:process';
import {
  PasswordResetContext,
  PasswordResetStateType,
} from './password-reset.context';
import { ContextMapper } from './mapper/mapper';
import { PasswordResetData } from './types/passwordResetData';
import { DomainException } from '../../../../libs/types/src/exceptions/domain-exception';
import { ErrorCode } from '../../../../libs/types/src/exceptions/error';
import { ContextRepository } from '../context/repository';

@Injectable()
export class RedisContextRepositoryImpl
  implements ContextRepository<PasswordResetContext>
{
  private redisClient = new Redis(process.env.REDIS_URL);

  constructor(private mapper: ContextMapper) {}

  async findById(userId: string): Promise<PasswordResetContext> {
    const data = await this.redisClient.get(userId);
    const state = await this.redisClient.get(userId + '-state');

    if (!data || !state) {
      throw new DomainException(ErrorCode.CHALLENGE_NOT_FOUND);
    }

    if (!this.isValidState(state))
      throw new DomainException(ErrorCode.CHALLENGE_NOT_FOUND);

    const res = this.mapper.toContext(JSON.parse(data), state);
    if (!res) {
      throw new DomainException(ErrorCode.CHALLENGE_NOT_FOUND);
    }

    return res;
  }

  async save(context: PasswordResetContext): Promise<void> {
    await this.redisClient.set(
      context.getPayload().memberId,
      JSON.stringify(PasswordResetData.encode(context.getPayload()))
    );

    await this.redisClient.set(
      context.getPayload().memberId + '-state',
      context.getState().getStateType()
    );
  }

  async deleteById(userId: string): Promise<void> {
    await this.redisClient.del(userId);
  }

  private isValidState(state: string): state is PasswordResetStateType {
    return (
      state === PasswordResetStateType.SMS ||
      state === PasswordResetStateType.SECURE_NO ||
      state === PasswordResetStateType.REQUEST_PASSWORD_RESET ||
      state === PasswordResetStateType.INITIAL
    );
  }
}
