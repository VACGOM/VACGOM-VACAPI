import { PasswordResetState } from '../password-reset.state';
import { StateType } from '@vacgom/types';

export type PasswordResetStateInstanceMap = {
  [x in StateType]: PasswordResetState;
};
