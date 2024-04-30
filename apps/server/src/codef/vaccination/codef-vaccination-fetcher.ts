import { Injectable } from '@nestjs/common';
import { VaccinationFetcher } from '../../vaccination/types/vaccination-fetcher';
import { VaccinationRequest, VaccinationResponse } from '@vacgom/types';
import { CodefService } from '../codef.service';
import { DomainException } from '../../exception/domain-exception';
import { ErrorCode } from '../../exception/error';
import { plainToInstance } from 'class-transformer';
import { VaccinationRecordResponse } from './types/vaccination-record.response';

@Injectable()
export class CodefVaccinationFetcher implements VaccinationFetcher {
  constructor(private codefService: CodefService) {}

  async fetch(request: VaccinationRequest): Promise<VaccinationResponse> {
    const codefResponse = await this.codefService.getVaccinationRecords(
      request.id,
      request.password
    );
    
    if (codefResponse.result.code === 'CF-00000') {
      const instance = plainToInstance(
        VaccinationRecordResponse,
        codefResponse
      );
      return instance.toVaccinationResponse();
    } else if (codefResponse.result.code === 'CF-12100') {
      if (
        codefResponse.result.extraMessage.includes(
          '비밀번호 오류 횟수가 5회를 초과'
        )
      )
        throw new DomainException(ErrorCode.PASSWORD_ERROR);
      else {
        throw new Error('Uncaught!');
      }
    } else if (codefResponse.result.code === 'CF-12800') {
      throw new DomainException(ErrorCode.ID_NOT_FOUND);
    } else if (codefResponse.result.code === 'CF-12801') {
      throw new DomainException(ErrorCode.PASSWORD_ERROR);
    } else {
      console.log(codefResponse);
      throw new Error('Uncaught!');
    }
  }
}
