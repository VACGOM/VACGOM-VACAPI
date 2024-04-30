import { Module } from '@nestjs/common';
import { VaccinationService } from './vaccination.service';
import { CodefModule } from '../codef/codef.module';
import { CodefVaccinationFetcher } from '../codef/vaccination/codef-vaccination-fetcher';
import { VaccinationController } from './vaccination.controller';

@Module({
  imports: [CodefModule],
  controllers: [VaccinationController],
  providers: [
    {
      provide: VaccinationService,
      useFactory: (...parsers) => new VaccinationService(parsers),
      inject: [CodefVaccinationFetcher],
    },
  ],
})
export class VaccinationModule {}
