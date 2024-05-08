import { FetchMyVaccinationStrategy } from '../../../nip/strategies/fetchMyVaccination/FetchMyVaccinationStrategy';
import { VaccinationRequest, VaccinationResponse } from '@vacgom/types';
import { CodefService } from '../../codef.service';
import { UnhandledCodefException } from '../../exceptions/UnhandledCodefException';
import { CodefException } from '../../exceptions/CodefException';
import { Injectable } from '@nestjs/common';
import { FetchMyVaccinationMapper } from './mapper';
import { PasswordService } from '../../password.service';

@Injectable()
export class ConcreteFetchMyVaccinationStrategy
  implements FetchMyVaccinationStrategy
{
  constructor(
    private codefService: CodefService,
    private passwordService: PasswordService,
    private mapper: FetchMyVaccinationMapper
  ) {}

  async fetchMyVaccination(
    request: VaccinationRequest
  ): Promise<VaccinationResponse> {
    try {
      const codefRequest = this.mapper.toCodefRequest(request);
      const encryptedPassword = this.passwordService.encryptPassword(
        codefRequest.userPassword
      );

      const response = await this.codefService.getVaccinationRecords({
        ...codefRequest,
        userPassword: encryptedPassword,
      });

      return this.mapper.toResponse(response);
    } catch (e) {
      if (this.isCodefException(e)) {
        throw new UnhandledCodefException(e);
      } else {
        throw e;
      }
    }
  }

  private isCodefException(e: any): boolean {
    return e instanceof CodefException;
  }
}
