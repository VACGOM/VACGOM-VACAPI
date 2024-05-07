import { PasswordResetState } from '../password-reset.state';
import { StateType } from '@vacgom/types';

export type States = {
  [x in StateType]: PasswordResetState;
};
