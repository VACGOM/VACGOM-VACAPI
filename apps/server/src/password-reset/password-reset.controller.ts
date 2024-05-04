import { Controller, Get } from '@nestjs/common';
import { Identity, Telecom } from '@vacgom/types';
import { ContextFactory } from './context.factory';
import { RedisContextRepositoryImpl } from './redis-context.repository';

@Controller('password-reset')
export class PasswordResetController {
  constructor(
    private factory: ContextFactory,
    private repository: RedisContextRepositoryImpl
  ) {}

  @Get('/')
  async test() {
    const context = this.factory.create('형주', {
      data: null,
      twoWayInfo: null,
    });

    await context.requestPasswordChange({
      name: '성형주',
      identity: Identity.parse('030912-3'),
      newPassword: '1234',
      telecom: Telecom.fromString('SKT'),
      phoneNumber: '01054763508',
    });

    const s = await context.requestSecureNoImage();
    console.log(context.request);
    return context.stateType;
  }

  @Get('/test')
  async test2() {
    const context = await this.repository.findByUserId('형주');
    console.log(context);
    await context.requestSecureNoImage();
    const s = await context.inputSecureNo('64995');
  }

  @Get('/test2')
  async test3() {
    const context = await this.repository.findByUserId('형주');
    console.log(context);
    return context.requestSecureNoImage();
  }
}
