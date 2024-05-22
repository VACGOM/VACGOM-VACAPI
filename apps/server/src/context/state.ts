import { StateKeys } from './context';

export type State<C, S extends StateKeys<any>> = {
  setContext(context: C): void;
  getStateType(): S;
};
