import { CodefResponse } from './types/common/codef.response';
import { CodefException } from './exceptions/CodefException';
import { DomainException } from '../exception/domain-exception';
import { ErrorCode } from '../exception/error';
import { UnhandledCodefException } from './exceptions/UnhandledCodefException';

export function validateResponse<T extends CodefResponse<any>>(response: T): T {
  switch (response.result.code) {
    case 'CF-03002':
    case 'CF-00000':
      return response;
    case 'CF-12100':
      throw new CodefException<T>(response);
    case 'CF-12800':
      throw new DomainException(ErrorCode.ID_NOT_FOUND);
    case 'CF-12801':
      throw new DomainException(ErrorCode.PASSWORD_ERROR);
    case 'CF-13301':
      throw new DomainException(ErrorCode.SECURE_NO_ERROR);
    default:
      throw new UnhandledCodefException(response);
  }
}
