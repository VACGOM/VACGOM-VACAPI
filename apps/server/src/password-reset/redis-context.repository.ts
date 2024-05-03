import { ContextRepository } from './context.repository';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as process from 'node:process';
import { PasswordResetContext } from './password-reset.context';
import { ContextMapper } from './mapper/mapper';

@Injectable()
export class RedisContextRepositoryImpl implements ContextRepository {
  private redisClient = new Redis(process.env.REDIS_URL);

  constructor(private mapper: ContextMapper) {}

  async findByUserId(userId: string): Promise<PasswordResetContext | null> {
    const data = await this.redisClient.get(userId);
    if (!data) {
      return null;
    }

    return this.mapper.toContext(JSON.parse(data));
  }

  async save(context: PasswordResetContext): Promise<void> {
    const dto = this.mapper.toDto(context);
    await this.redisClient.set(context.memberId, JSON.stringify(dto));
  }
}
