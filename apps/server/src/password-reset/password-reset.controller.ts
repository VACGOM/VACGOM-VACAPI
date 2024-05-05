import { Controller, Get } from '@nestjs/common';
import { Identity, Telecom } from '@vacgom/types';
import { ContextFactory } from './context.factory';
import { RedisContextRepositoryImpl } from './redis-context.repository';
import { StateType } from './password-reset.state';

@Controller('password-reset')
export class PasswordResetController {
  constructor(
    private factory: ContextFactory,
    private repository: RedisContextRepositoryImpl
  ) {}

  @Get('/')
  async test() {
    const context = this.factory.create(StateType.REQUEST_PASSWORD_RESET, {
      stateType: StateType.INITIAL.toString(),
      memberId: '형주',
      requestInfo: null,
      secureNoImage: null,
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
    console.log(context);
    return context.data.stateType;
  }

  @Get('/test')
  async test2() {
    const context = await this.repository.findByUserId('형주');

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
