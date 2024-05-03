import { PasswordResetState, StateType } from '../password-reset.state';

export type States = {
  [x in StateType]: PasswordResetState;
};
