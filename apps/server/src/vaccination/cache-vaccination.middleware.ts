import { JSONRPCCallbackType, JSONRPCResultLike } from 'jayson';
import { Request } from 'express';
import { VaccinationCacheService } from './cache.service';
import { AuthenticatedRequest } from '../password-reset/auth.middleware';
import { JsonRpcMiddleware, JsonRpcMiddlewareInterface } from 'nestjs-jayson';

@JsonRpcMiddleware()
export class CacheVaccinationMiddleware implements JsonRpcMiddlewareInterface {
  constructor(private vaccinationCacheService: VaccinationCacheService) {}

  async use(
    req: Request & AuthenticatedRequest,
    callback: JSONRPCCallbackType,
    next: (err: any) => void
  ): Promise<void> {
    const result = await this.vaccinationCacheService.get(req.userId);
    if (result) {
      console.log('Cache hit');
      callback(null, result as JSONRPCResultLike);
    } else next(null);
  }
}
