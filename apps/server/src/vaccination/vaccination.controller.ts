import { VaccinationRequest, VaccinationResponse } from '@vacgom/types';
import { NipService } from '../nip/nip.service';
import {
  Body,
  JsonRpcController,
  JsonRpcMethod,
  Req,
} from '../json-rpc/json-rpc.decorator';
import { Injectable } from '@nestjs/common';
import { isLeft } from 'fp-ts/These';
import { ValidationError } from '../password-reset/exception/ValidationError';
import { VaccinationCacheService } from './cache.service';
import { AuthenticatedRequest } from '../password-reset/auth.middleware';

@Injectable()
@JsonRpcController('vaccination', [])
export class VaccinationController {
  constructor(
    private nipService: NipService,
    private cacheService: VaccinationCacheService
  ) {}

  @JsonRpcMethod('getVaccinationRecords')
  async getVaccinationRecords(
    @Body request: VaccinationRequest,
    @Req req: AuthenticatedRequest
  ): Promise<VaccinationResponse> {
    const validate = VaccinationRequest.decode(request);
    if (isLeft(validate)) {
      throw new ValidationError(validate.left);
    }
    const response = await this.nipService.fetchMyVaccination(request);
    this.cacheService.set(req.userId, response);

    return response;
  }
}
