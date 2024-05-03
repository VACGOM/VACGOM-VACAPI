import { PasswordResetContext } from '../password-reset.context';
import { ContextOutputDto } from '../dtos/context-output.dto';
import { RequestInfo } from '../request';
import { ResetPasswordRequest } from '../../nip/strategies/resetPassword/request';
import { Identity, Telecom } from '@vacgom/types';
import { ContextFactory } from '../context.factory';
import { StateType } from '../password-reset.state';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

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
        identity: context.request.data.identity.to9DigitIdentity(),
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
    const twoWayInfo = dto.requestInfo.twoWayInfo
      ? {
          jobIndex: dto.requestInfo.twoWayInfo.jobIndex,
          jti: dto.requestInfo.twoWayInfo.jti,
          threadIndex: dto.requestInfo.twoWayInfo.threadIndex,
          twoWayTimestamp: dto.requestInfo.twoWayInfo.twoWayTimestamp,
        }
      : undefined;

    const requestInfo = new RequestInfo<ResetPasswordRequest>(
      {
        identity: Identity.from9DigitIdentity(dto.requestInfo.identity),
        name: dto.requestInfo.name,
        newPassword: dto.requestInfo.newPassword,
        phoneNumber: dto.requestInfo.phoneNumber,
        telecom: Telecom[dto.requestInfo.telecom],
      },
      twoWayInfo
    );

    const state = dto.stateType as StateType;

    console.log(state);
    return this.factory.create(
      dto.memberId,
      requestInfo,
      state,
      dto.secureNoImage
    );
  }
}
