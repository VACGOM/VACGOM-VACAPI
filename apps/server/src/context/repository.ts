import { Context } from './context';

export interface ContextRepository<C extends Context<any, any, any>> {
  findById(id: string): Promise<C>;

  save(context: C): Promise<void>;

  deleteById(id: string): Promise<void>;
}
