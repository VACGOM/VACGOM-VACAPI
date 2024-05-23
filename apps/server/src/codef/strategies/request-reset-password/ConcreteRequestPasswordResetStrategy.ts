import { RequestPasswordResetStrategy } from '../../../nip/strategies/resetPassword/RequestPasswordResetStrategy';
import { CodefService } from '../../codef.service';
import { Injectable } from '@nestjs/common';
import { PasswordService } from '../../password.service';
import { NipResetPasswordRequest } from '../../../nip/strategies/resetPassword/request';
import { NipResetPasswordResponse } from '../../../nip/strategies/resetPassword/response';
import { Mapper } from './mapper';

@Injectable()
export class ConcreteRequestPasswordResetStrategy
  implements RequestPasswordResetStrategy
{
  constructor(
    private codefService: CodefService,
    private passwordService: PasswordService,
    private mapper: Mapper
  ) {}

  async requestPasswordReset(
    request: NipResetPasswordRequest
  ): Promise<NipResetPasswordResponse> {
    const codefRequest = this.mapper.toCodefRequest(request);
    const response = await this.codefService.resetPassword(codefRequest);

    return this.mapper.toNipResponse(response);
  }
}
