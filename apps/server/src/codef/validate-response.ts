import { CodefResponse } from './types/common/codef.response';
import { CodefException } from './exceptions/CodefException';
import { DomainException } from '../../../../libs/types/src/exceptions/domain-exception';
import { ErrorCode } from '../../../../libs/types/src/exceptions/error';
import { UnhandledCodefException } from './exceptions/UnhandledCodefException';

export function validateResponse<T extends CodefResponse<any>>(response: T): T {
  switch (response.result.code) {
    case 'CF-03002':
    case 'CF-00000':
      return response;
    case 'CF-12100':
      if (response.result.message.includes('회원이 아닙니다'))
        throw new DomainException(ErrorCode.NOT_MEMBER);
      throw new CodefException<T>(response);
    case 'CF-12800':
      throw new DomainException(ErrorCode.ID_NOT_FOUND);
    case 'CF-12801':
      throw new DomainException(ErrorCode.PASSWORD_ERROR);
    case 'CF-13301':
      throw new DomainException(ErrorCode.SECURE_NO_ERROR);
    case 'CF-01004':
      throw new DomainException(ErrorCode.TIMEOUT_ERROR);
    case 'CF-00025':
      throw new DomainException(ErrorCode.DUPLICATE_REQUEST);
    case 'CF-12834':
      throw new DomainException(ErrorCode.VERIFICATION_BLOCKED);
    case 'CF-12835':
      throw new DomainException(ErrorCode.INVALID_INFO);
    default:
      throw new UnhandledCodefException(response);
  }
}
