import { Injectable } from '@nestjs/common';
import { VaccinationRequest, VaccinationResponse } from '@vacgom/types';
import { FetchMyVaccinationStrategy } from './strategies/fetchMyVaccination/FetchMyVaccinationStrategy';

@Injectable()
export class NipService {
  constructor(private fetchMyVaccinationStrategy: FetchMyVaccinationStrategy) {}

  public async fetchMyVaccination(
    request: VaccinationRequest
  ): Promise<VaccinationResponse> {
    return this.fetchMyVaccinationStrategy.fetchMyVaccination(request);
  }
}
