import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JsonRpcService } from './json-rpc.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private jsonService: JsonRpcService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const context = {
      req: req,
    };

    const server = this.jsonService.getServer();

    server.call(req.body, context, function (err, result) {
      if (err) return res.send(err);
      res.send(result || {});
    });
  }
}
