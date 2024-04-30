import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as crypto from 'crypto';
import { IdempotencyService } from './idempotency.service';

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  constructor(private idempotencyService: IdempotencyService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const result = await this.idempotencyService.process(
      this.generateIdempotencyKey(req),
      next.bind(this),
    );

    if (!result) {
      res.status(400).json({
        message: 'duplicated request',
      });
    }
  }

  private generateIdempotencyKey(req: Request): string {
    const payload = `${req.path}-${req.method}-${JSON.stringify(req.body)}`;

    return crypto.createHash('sha256').update(payload).digest('hex');
  }
}
