import { Injectable } from '@nestjs/common';
import { ResetPasswordRequest } from '../../../nip/strategies/resetPassword/request';
import { CodefResetPasswordRequest } from '../../dtos/reset-password/codef-reset-password.request';
import { PasswordService } from '../../password.service';

@Injectable()
export class RequestResetPasswordMapper {
  constructor(private passwordService: PasswordService) {}

  public toCodefResetPasswordRequest(
    request: ResetPasswordRequest
  ): CodefResetPasswordRequest {
    return {
      organization: '0011',
      authMethod: '0',
      userName: request.name,
      userPassword: this.passwordService.encryptPassword(request.newPassword),
      phoneNo: request.phoneNumber,
      identity: request.identity.to9DigitIdentity(),
      telecom: request.telecom.toString(),
      timeout: '170',
    };
  }
}
