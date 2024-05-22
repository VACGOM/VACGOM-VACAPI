import { PasswordResetState } from '../password-reset.state';
import { NipService } from '../../nip/nip.service';
import { Injectable } from '@nestjs/common';
import { DomainException } from '../../exception/domain-exception';
import { ErrorCode } from '../../exception/error';
import { ResetPasswordRequest } from '@vacgom/types';
import {
  PasswordResetStateKeys,
  PasswordResetStateType,
} from '../password-reset.context';

@Injectable()
export class InitialState extends PasswordResetState {
  constructor(private nipService: NipService) {
    super();
  }

  public async requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    const payload = this.context.getPayload();

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

    this.context.changeState(PasswordResetStateType.SECURE_NO);
    this.context.setPayload({
      ...payload,
      requestInfo: request,
      secureNoImage: response.secureNoImage,
      twoWayInfo: response.twoWayInfo,
    });

    return true;
  }

  public getStateType(): PasswordResetStateKeys {
    return PasswordResetStateType.INITIAL;
  }
}
