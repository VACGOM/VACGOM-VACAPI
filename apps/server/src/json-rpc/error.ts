export class JsonRpcError<T> extends Error {
  constructor(public code: number, public message: string, public data?: T) {
    super(message);
  }
}
