import { PasswordResetState, StateType } from '../password-reset.state';
import { NipService } from '../../nip/nip.service';
import { Injectable } from '@nestjs/common';
import { DomainException } from '../../exception/domain-exception';
import { ErrorCode } from '../../exception/error';
import { ResetPasswordRequest } from '../types/reset-password.request';

@Injectable()
export class InitialState extends PasswordResetState {
  constructor(private nipService: NipService) {
    super();
  }

  public async requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    console.log(request, 'requestPasswordChange');
    this.context.data.requestInfo = request;
    const response = await this.nipService.requestPasswordReset({
      type: 'RequestResetPassword',
      name: request.name,
      identity: request.identity,
      newPassword: request.newPassword,
      telecom: request.telecom,
      phoneNumber: request.phoneNumber,
    });

    if (response.type != 'SecureNo')
      throw new DomainException(ErrorCode.UNSUPPORTED_OPERATION);

    this.context.data.secureNoImage = response.secureNoImage;
    this.context.data.twoWayInfo = response.twoWayInfo;

    this.context.changeState(StateType.REQUEST_PASSWORD_RESET);
    return true;
  }
}
