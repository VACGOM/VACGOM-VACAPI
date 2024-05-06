import * as jayson from 'jayson';

export interface ExceptionFilter<T extends Error> {
  catch(
    exception: T,
    callback: jayson.JSONRPCCallbackType
  ): Promise<void> | void;
}
