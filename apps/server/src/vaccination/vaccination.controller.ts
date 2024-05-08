import { VaccinationRequest, VaccinationResponse } from '@vacgom/types';
import { NipService } from '../nip/nip.service';
import {
  Body,
  JsonRpcController,
  JsonRpcMethod,
} from '../json-rpc/json-rpc.decorator';
import { Injectable } from '@nestjs/common';
import { isLeft } from 'fp-ts/These';
import { ValidationError } from '../password-reset/exception/ValidationError';

@Injectable()
@JsonRpcController('vaccination', [])
export class VaccinationController {
  constructor(private nipService: NipService) {}

  @JsonRpcMethod('getVaccinationRecords')
  async getVaccinationRecords(
    @Body request: VaccinationRequest
  ): Promise<VaccinationResponse> {
    const validate = VaccinationRequest.decode(request);
    if (isLeft(validate)) {
      throw new ValidationError(validate.left);
    }
    return this.nipService.fetchMyVaccination(request);
  }
}
