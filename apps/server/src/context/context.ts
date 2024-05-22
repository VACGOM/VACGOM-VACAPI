import { ContextRepository } from './repository';
import { State } from './state';
import { Data } from './data';

export type StateMap<K extends StateKeys<any>, S> = Map<K, S>;

export type StateKeys<K extends string[]> = K[number];

export abstract class Context<
  P,
  S extends State<Context<P, S, K>, K>,
  K extends StateKeys<any>
> {
  protected constructor(
    protected states: StateMap<K, S>,
    protected repository: ContextRepository<Context<P, S, K>>,
    protected data: Data<S, P>
  ) {
    this.changeState(data.state.getStateType());
  }

  public changeState(state: K): void {
    const instance = this.states.get(state);
    if (!instance) {
      throw new Error(`State ${state} not found`);
    }

    this.data.state = instance;
    this.data.state.setContext(this);
  }

  getPayload(): P {
    return { ...this.data.payload };
  }

  setPayload(payload: P): void {
    this.data.payload = payload;
  }

  getState(): S {
    return this.data.state;
  }
}
