import { ContextRepository } from './context.repository';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as process from 'node:process';
import { PasswordResetContext } from './password-reset.context';
import { ContextMapper } from './mapper/mapper';
import { Context } from './types/context';

@Injectable()
export class RedisContextRepositoryImpl implements ContextRepository {
  private redisClient = new Redis(process.env.REDIS_URL);

  constructor(private mapper: ContextMapper) {}

  async findByUserId(userId: string): Promise<PasswordResetContext | null> {
    const data = await this.redisClient.get(userId);
    if (!data) {
      return null;
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
