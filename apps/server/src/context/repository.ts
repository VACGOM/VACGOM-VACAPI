import { Context } from './context';

export interface ContextRepository<C extends Context<any, any, any>> {
  findById(id: string): Promise<C>;

  save(context: C): Promise<void>;

  deleteById(id: string): Promise<void>;
}

export const PersistMethod: MethodDecorator = (
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;
  descriptor.value = async function (this: any, ...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } finally {
      await this.save();
    }
  };
};
