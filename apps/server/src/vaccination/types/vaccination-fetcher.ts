import { VaccinationRequest, VaccinationResponse } from '@vacgom/types';

export interface VaccinationFetcher {
  fetch(request: VaccinationRequest): Promise<VaccinationResponse>;
}

export const VACCINATION_FETCHER = Symbol('VaccinationFetcher');
