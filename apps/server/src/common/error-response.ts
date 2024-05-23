import { BaseResponse } from '@vacgom/types';
import { ErrorData } from '../../../../libs/types/src/exceptions/error';

export class ErrorResponse extends BaseResponse<ErrorData> {
  static of(errorData: ErrorData, message: string): ErrorResponse {
    return new ErrorResponse(false, message, errorData);
  }
}
