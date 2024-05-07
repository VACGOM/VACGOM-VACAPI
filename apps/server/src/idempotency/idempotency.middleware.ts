import { IdempotencyService } from './idempotency.service';
import { DomainException } from '../exception/domain-exception';
import { ErrorCode } from '../exception/error';
import { JsonRpcMiddleware } from '../json-rpc/json-rpc.decorator';
import { JsonRpcMiddlewareInterface } from '../json-rpc/json-rpc-middleware.interface';
import * as crypto from 'node:crypto';
import { JSONRPCCallbackType } from 'jayson';
import { Request } from 'express';

@JsonRpcMiddleware()
export class IdempotencyMiddleware implements JsonRpcMiddlewareInterface {
  constructor(private idempotencyService: IdempotencyService) {}

  async use(
    req: Request,
    callback: JSONRPCCallbackType,
    next: (err: any) => void
  ): Promise<void> {
    const result = await this.idempotencyService.process(
      this.generateIdempotencyKey(req),
      next.bind(this)
    );

    if (!result) {
      console.log('Duplicated request');
      throw new DomainException(ErrorCode.DUPLICATED_REQUEST);
    }
  }

  private generateIdempotencyKey(req: Request): string {
    const payload = req.headers.authorization;

    return crypto.createHash('sha256').update(payload).digest('hex');
  }
}
