import { JSONRPCCallbackType } from 'jayson';
import { Request } from 'express';

export interface JsonRpcMiddlewareInterface {
  use(
    req: Request,
    callback: JSONRPCCallbackType,
    next: (err: any) => void
  ): void | Promise<void>;
}
