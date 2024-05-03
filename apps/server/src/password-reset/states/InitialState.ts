import { PasswordResetState, StateType } from '../password-reset.state';
import { NipService } from '../../nip/nip.service';
import { Injectable } from '@nestjs/common';
import { ResetPasswordRequest } from '../../nip/strategies/resetPassword/request';

@Injectable()
export class InitialState extends PasswordResetState {
  constructor(private nipService: NipService) {
    super();
  }

  public async requestPasswordChange(
    request: ResetPasswordRequest
  ): Promise<boolean> {
    console.log(request, 'requestPasswordChange');
    this.context.request.setData(request);
    const response = await this.nipService.requestPasswordReset(request);

    this.context.secureNoImage = response.secureNoImage;
    this.context.request.setTwoWayInfo(response.twoWayInfo);

    this.context.changeState(StateType.REQUEST_PASSWORD_RESET);

    return true;
  }
}
