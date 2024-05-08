import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { VaccinationResponse } from '@vacgom/types';

@Injectable()
export class VaccinationCacheService {
  private redisClient = new Redis(process.env.REDIS_URL);

  constructor() {}

  async get(userId: string): Promise<VaccinationResponse | null> {
    const res = await this.redisClient.get(this.generateKey(userId));
    if (!res) {
      return null;
    }

    return JSON.parse(res);
  }

  async set(userId: string, data: VaccinationResponse): Promise<void> {
    this.redisClient.set(
      this.generateKey(userId),
      JSON.stringify(data),
      'EX',
      60
    );
  }

  private generateKey(userId: string): string {
    return `vaccination:${userId}`;
  }
}
