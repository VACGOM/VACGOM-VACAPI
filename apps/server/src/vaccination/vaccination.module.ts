import { Module } from '@nestjs/common';
import { CodefModule } from '../codef/codef.module';
import { VaccinationController } from './vaccination.controller';
import { NipModule } from '../nip/nip.module';

@Module({
  imports: [CodefModule, NipModule],
  controllers: [VaccinationController],
})
export class VaccinationModule {}
