import { PasswordResetState } from '../password-reset.state';
import { Injectable } from '@nestjs/common';

import { NipService } from '../../nip/nip.service';
import { DomainException } from '../../exception/domain-exception';
import { ErrorCode } from '../../exception/error';
import { ResetPasswordRequest, StateType } from '@vacgom/types';

@Injectable()
export class SMSState extends PasswordResetState {
  constructor(private nipService: NipService) {
    super();
  }

  public async requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    this.context.changeState(StateType.INITIAL);
    return this.context.state.requestPasswordChange(request);
  }

  public async inputSMSCode(smsCode: string): Promise<boolean> {
    const savedRequest = this.context.data.requestInfo;

    const response = await this.nipService.requestPasswordReset({
      type: 'InputSMS',
      smsAuthNo: smsCode,
      name: savedRequest.name,
      identity: savedRequest.identity,
      newPassword: savedRequest.newPassword,
      telecom: savedRequest.telecom,
      phoneNumber: savedRequest.phoneNumber,
      twoWayInfo: this.context.data.twoWayInfo,
    });

    if (response.type == 'PasswordChangeFailed') {
      this.context.changeState(StateType.REQUEST_PASSWORD_RESET);
      throw new DomainException(ErrorCode.CODEF_ERROR, response.result);
    }
    return true;
  }
}
