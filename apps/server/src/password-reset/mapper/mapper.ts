import { PasswordResetContext } from '../password-reset.context';
import { ContextFactory } from '../context.factory';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { isLeft } from 'fp-ts/These';
import { Context } from '../types/context';
import { StateType } from '@vacgom/types';

@Injectable()
export class ContextMapper {
  constructor(
    @Inject(forwardRef(() => ContextFactory))
    private factory: ContextFactory
  ) {}

  public toContext(context: Context): PasswordResetContext {
    const requestInfo = Context.decode(context);
    if (isLeft(requestInfo)) {
      console.log(requestInfo.left);

      throw new Error();
    }

    const state = requestInfo.right.stateType as StateType;
    return this.factory.create(state, requestInfo.right);
  }
}
