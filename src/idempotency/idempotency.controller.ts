import { Controller, Post } from '@nestjs/common';

@Controller('idempotency')
export class IdempotencyController {
  @Post('test')
  async test() {
    return 'test';
  }
}
