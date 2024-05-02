import { Body, Controller, Get } from '@nestjs/common';
import { VaccinationRequest, VaccinationResponse } from '@vacgom/types';
import { NipService } from '../nip/nip.service';

@Controller('vaccinations')
export class VaccinationController {
  constructor(private nipService: NipService) {}

  @Get('/')
  async getVaccinationRecords(
    @Body() request: VaccinationRequest
  ): Promise<VaccinationResponse> {
    return this.nipService.fetchMyVaccination(request);
  }
}
