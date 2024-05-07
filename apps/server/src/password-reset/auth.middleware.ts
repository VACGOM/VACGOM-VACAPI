import { NextFunction, Request } from 'express';
import { JsonRpcMiddlewareInterface } from '../json-rpc/json-rpc-middleware.interface';
import { JSONRPCCallbackType } from 'jayson';
import { DomainException } from '../exception/domain-exception';
import { ErrorCode } from '../exception/error';
import jwt from 'jsonwebtoken';
import { JsonRpcMiddleware } from '../json-rpc/json-rpc.decorator';

export type JwtPayload = {
  sub: string;
  exp: number;
};

export type AuthenticatedRequest = Request & {
  userId: string;
};

@JsonRpcMiddleware()
export class AuthMiddleware implements JsonRpcMiddlewareInterface {
  async use(
    req: AuthenticatedRequest,
    callback: JSONRPCCallbackType,
    next: NextFunction
  ): Promise<void> {
    console.log(req.headers);
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log(token);
    if (token == null) throw new DomainException(ErrorCode.AUTH_MISSING);
    if (process.env.JWT_SECRET == null)
      throw new Error('JWT_SECRET is not defined');

    const secret = Buffer.from(process.env.JWT_SECRET, 'base64');

    console.log(process.env.JWT_SECRET);
    console.log(secret);

    jwt.verify(token, secret, (err, user) => {
      if (err instanceof jwt.TokenExpiredError)
        throw new DomainException(ErrorCode.TOKEN_EXPIRED);
      if (err != null) throw new DomainException(ErrorCode.INVALID_AUTH);
      const payload = user as JwtPayload;

      req.userId = payload.sub;
      next();
    });
  }
}
