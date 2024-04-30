import { Controller, Get } from '@nestjs/common';
import { CodefService } from './codef.service';

@Controller('codef')
export class CodefController {
  constructor(private codefService: CodefService) {}

  @Get('vaccination-records')
  getVaccinationRecords() {
    return this.codefService.getVaccinationRecords('', '');
  }
}
