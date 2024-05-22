import { StateKeys } from './context';

export type Data<S extends StateKeys<any>, P> = {
  state: S;
  payload: P;
};
