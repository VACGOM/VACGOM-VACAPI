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
  protected state: S;

  public constructor(
    protected states: StateMap<K, S>,
    protected repository: ContextRepository<Context<P, S, K>>,
    protected data: Data<S, P>
  ) {}

  public changeState(state: K): void {
    this.data.state = this.states.get(state);
    this.data.state.setContext(this);
  }

  getPayload(): P {
    return this.data.payload;
  }

  getState(): S {
    return this.data.state;
  }
}
