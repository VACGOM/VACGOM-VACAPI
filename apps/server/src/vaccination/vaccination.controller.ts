import { Body, Controller, Get } from '@nestjs/common';
import { VaccinationService } from './vaccination.service';
import { VaccinationRequest, VaccinationResponse } from '@vacgom/types';

@Controller('vaccinations')
export class VaccinationController {
  constructor(private vaccinationService: VaccinationService) {}

  @Get('/')
  async getVaccinationRecords(
    @Body() request: VaccinationRequest
  ): Promise<VaccinationResponse> {
    return this.vaccinationService.getVaccinations(request);
  }
}
