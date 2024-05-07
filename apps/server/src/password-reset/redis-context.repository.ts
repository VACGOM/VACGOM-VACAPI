import { ContextRepository } from './context.repository';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as process from 'node:process';
import { PasswordResetContext } from './password-reset.context';
import { ContextMapper } from './mapper/mapper';
import { Context } from './types/context';
import { DomainException } from '../exception/domain-exception';
import { ErrorCode } from '../exception/error';

@Injectable()
export class RedisContextRepositoryImpl implements ContextRepository {
  private redisClient = new Redis(process.env.REDIS_URL);

  constructor(private mapper: ContextMapper) {}

  async getByUserId(userId: string): Promise<PasswordResetContext> {
    const data = await this.redisClient.get(userId);
    if (!data) {
      throw new DomainException(ErrorCode.CHALLENGE_NOT_FOUND);
    }

    const res = this.mapper.toContext(JSON.parse(data));
    console.log('decoderes', res);

    return res;
  }

  async save(context: PasswordResetContext): Promise<void> {
    console.log(context.data);
    await this.redisClient.set(
      context.data.memberId,
      JSON.stringify(Context.encode(context.data))
    );
  }
}
