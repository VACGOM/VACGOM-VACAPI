import { StateType } from '../password-reset.state';

export class ContextOutput<T> {
  constructor(public success: boolean, public state: string, public data: T) {}

  static success<T>(state: StateType, data: T): ContextOutput<T> {
    return new ContextOutput(true, state, data);
  }

  static failure<T>(state: StateType, data: T): ContextOutput<T> {
    return new ContextOutput(false, state, data);
  }
}
