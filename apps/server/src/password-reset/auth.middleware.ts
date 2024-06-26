import { NextFunction, Request } from 'express';
import { JSONRPCCallbackType } from 'jayson';
import { DomainException } from '../../../../libs/types/src/exceptions/domain-exception';
import { ErrorCode } from '../../../../libs/types/src/exceptions/error';
import jwt from 'jsonwebtoken';
import { JsonRpcMiddleware, JsonRpcMiddlewareInterface } from 'nestjs-jayson';

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
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token == null) throw new DomainException(ErrorCode.AUTH_MISSING);
    if (process.env.JWT_SECRET == null)
      throw new Error('JWT_SECRET is not defined');

    const secret = Buffer.from(process.env.JWT_SECRET, 'base64');

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
