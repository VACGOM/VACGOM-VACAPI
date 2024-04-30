import { Injectable } from '@nestjs/common';
import Redlock from 'redlock';
import Redis from 'ioredis';

@Injectable()
export class IdempotencyService {
  private redisClient = new Redis(process.env.REDIS_URL);
  public redLock = new Redlock([this.redisClient]);

  public async process(
    idempotencyKey: string,
    fn: () => Promise<any>,
  ): Promise<boolean> {
    return this.redLock.using([idempotencyKey], 5000, async (signal) => {
      const isHit = await this.isHit(idempotencyKey);
      if (isHit) return false;

      await fn();

      await this.save(idempotencyKey);
      return true;
    });
  }

  public async isHit(idempotencyKey: string): Promise<boolean> {
    const res = await this.redisClient.exists(`request-${idempotencyKey}`);
    return res === 1;
  }

  public async save(idempotencyKey: string): Promise<void> {
    await this.redisClient.set(`request-${idempotencyKey}`, 1, 'EX', 5);
  }
}
