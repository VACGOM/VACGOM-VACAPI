import { PasswordResetContext } from '../password-reset.context';
import { ContextOutputDto } from '../dtos/context-output.dto';
import { RequestInfoType } from '../request';
import { ContextFactory } from '../context.factory';
import { StateType } from '../password-reset.state';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { isLeft } from 'fp-ts/These';
import { ResetPasswordRequest } from '../types/reset-password.request';

@Injectable()
export class ContextMapper {
  constructor(
    @Inject(forwardRef(() => ContextFactory))
    private factory: ContextFactory
  ) {}

  public toDto(context: PasswordResetContext): ContextOutputDto {
    return {
      memberId: context.memberId,
      stateType: context.stateType,
      secureNoImage: context.secureNoImage,
      requestInfo: {
        identity: context.request.data.identity.toString(),
        name: context.request.data.name,
        newPassword: context.request.data.newPassword,
        phoneNumber: context.request.data.phoneNumber,
        telecom: context.request.data.telecom.toString(),
        twoWayInfo: context.request.twoWayInfo
          ? {
              jobIndex: context.request.twoWayInfo.jobIndex,
              jti: context.request.twoWayInfo.jti,
              threadIndex: context.request.twoWayInfo.threadIndex,
              twoWayTimestamp: context.request.twoWayInfo.twoWayTimestamp,
            }
          : undefined,
      },
    };
  }

  public toContext(dto: ContextOutputDto): PasswordResetContext {
    const requestInfo = RequestInfoType(ResetPasswordRequest).decode(
      dto.requestInfo
    );
    if (isLeft(requestInfo)) throw new Error('Invalid request info');

    const state = dto.stateType as StateType;

    return this.factory.create(
      dto.memberId,
      requestInfo.right,
      state,
      dto.secureNoImage
    );
  }
}
