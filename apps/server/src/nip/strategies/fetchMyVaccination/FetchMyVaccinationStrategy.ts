import { VaccinationRequest, VaccinationResponse } from '@vacgom/types';

export interface FetchMyVaccinationStrategy {
  fetchMyVaccination(request: VaccinationRequest): Promise<VaccinationResponse>;
}

export const FetchMyVaccinationStrategy = Symbol(
  'RequestPasswordResetStrategy'
);
