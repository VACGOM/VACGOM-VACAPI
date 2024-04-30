import { Inject, Injectable } from '@nestjs/common';
import { VaccinationRequest, VaccinationResponse } from '@vacgom/types';
import {
  VACCINATION_FETCHER,
  VaccinationFetcher,
} from './types/vaccination-fetcher';

@Injectable()
export class VaccinationService {
  constructor(
    @Inject(VACCINATION_FETCHER)
    private vaccinationFetchers: VaccinationFetcher[]
  ) {}

  public async getVaccinations(
    request: VaccinationRequest
  ): Promise<VaccinationResponse> {
    const response = await Promise.all(
      this.vaccinationFetchers.map((fetcher) => fetcher.fetch(request))
    );

    return {
      vaccinationIdentity: response
        .map((res) => res.vaccinationIdentity)
        .filter((i) => i)[0],
      vaccineList: response.flatMap((res) => res.vaccineList),
    };
  }
}
