import {
  PasswordResetContext,
  PasswordResetStateType,
} from '../password-reset.context';
import { ContextFactory } from '../context.factory';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { isLeft } from 'fp-ts/These';
import { PasswordResetData } from '../types/passwordResetData';

@Injectable()
export class ContextMapper {
  constructor(
    @Inject(forwardRef(() => ContextFactory))
    private factory: ContextFactory
  ) {}

  public toContext(
    context: PasswordResetData,
    state: PasswordResetStateType
  ): PasswordResetContext {
    const requestInfo = PasswordResetData.decode(context);
    if (isLeft(requestInfo)) {
      return null;
    }

    return this.factory.create(state, requestInfo.right);
  }
}
