import { Inject, Injectable } from '@nestjs/common';
import { VaccinationRequest, VaccinationResponse } from '@vacgom/types';
import { FetchMyVaccinationStrategy } from './strategies/fetchMyVaccination/FetchMyVaccinationStrategy';
import { RequestPasswordResetStrategy } from './strategies/resetPassword/RequestPasswordResetStrategy';
import {
  ResetPasswordRequest,
  SecureNoResponse,
} from './strategies/resetPassword/request';

@Injectable()
export class NipService {
  constructor(
    @Inject(FetchMyVaccinationStrategy)
    private fetchMyVaccinationStrategy: FetchMyVaccinationStrategy,
    @Inject(RequestPasswordResetStrategy)
    private requestPasswordResetStrategy: RequestPasswordResetStrategy
  ) {}

  public async fetchMyVaccination(
    request: VaccinationRequest
  ): Promise<VaccinationResponse> {
    return this.fetchMyVaccinationStrategy.fetchMyVaccination(request);
  }

  public async requestPasswordReset(
    request: ResetPasswordRequest
  ): Promise<SecureNoResponse> {
    return this.requestPasswordResetStrategy.requestPasswordReset(request);
  }
}
