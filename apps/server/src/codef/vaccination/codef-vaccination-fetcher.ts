import { Injectable } from '@nestjs/common';
import { VaccinationFetcher } from '../../vaccination/types/vaccination-fetcher';
import { VaccinationRequest, VaccinationResponse } from '@vacgom/types';
import { CodefService } from '../codef.service';
import { plainToInstance } from 'class-transformer';
import { VaccinationRecordResponse } from './types/vaccination-record.response';
import { CodefException } from '../exceptions/CodefException';
import { DomainException } from '../../exception/domain-exception';
import { ErrorCode } from '../../exception/error';
import { UnhandledCodefException } from '../exceptions/UnhandledCodefException';

@Injectable()
export class CodefVaccinationFetcher implements VaccinationFetcher {
  constructor(private codefService: CodefService) {}

  async fetch(request: VaccinationRequest): Promise<VaccinationResponse> {
    try {
      const codefResponse = await this.codefService.getVaccinationRecords(
        request.id,
        request.password
      );

      const instance = plainToInstance(
        VaccinationRecordResponse,
        codefResponse
      );
      return instance.toVaccinationResponse();
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
