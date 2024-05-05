import { FetchMyVaccinationStrategy } from '../../../nip/strategies/fetchMyVaccination/FetchMyVaccinationStrategy';
import { VaccinationRequest, VaccinationResponse } from '@vacgom/types';
import { CodefService } from '../../codef.service';
import { DomainException } from '../../../exception/domain-exception';
import { ErrorCode } from '../../../exception/error';
import { UnhandledCodefException } from '../../exceptions/UnhandledCodefException';
import { CodefException } from '../../exceptions/CodefException';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConcreteFetchMyVaccinationStrategy
  implements FetchMyVaccinationStrategy
{
  constructor(private codefService: CodefService) {}

  async fetchMyVaccination(
    request: VaccinationRequest
  ): Promise<VaccinationResponse> {
    try {
      throw new Error('Not implemented');
    } catch (e) {
      if (!this.isCodefException(e)) throw e;

      const extraMessage = e.result.result.extraMessage;
      if (extraMessage.includes('비밀번호 오류 횟수가 5회를 초과'))
        throw new DomainException(ErrorCode.PASSWORD_ERROR);
      else throw new UnhandledCodefException(e);
    }
  }

  private isCodefException(e: any): boolean {
    return e instanceof CodefException;
  }
}
