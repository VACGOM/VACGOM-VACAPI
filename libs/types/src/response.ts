export class BaseResponse<T> {
  success!: boolean;
  message!: string;
  data?: T;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static ok<T>(data: T): BaseResponse<T> {
    return new BaseResponse<T>(true, '', data);
  }

  static fail<T>(message: string): BaseResponse<T> {
    return new BaseResponse<T>(false, message);
  }
}
