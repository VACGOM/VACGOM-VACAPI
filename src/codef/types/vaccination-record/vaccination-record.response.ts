import { CodefResponse } from '../common/codef.response';

export class VaccinationRecordResponse extends CodefResponse<CodefMyVaccinationData> {}

class CodefMyVaccinationData {
  resUserNm!: string;
  resUserIdentiyNo!: string;
  resVaccineList!: CodefResVacccine[];
}

interface CodefResVacccine {
  resEpidemicType: string;
  resEpidemicNm: string;
  resVaccineNm: string;
  resInoculationOrder: string;
  resDetailList: CodefResDetail[];
}

interface CodefResDetail {
  resVaccinationNm: string;
  resInoculationOrder: string;
  resInoculationDate: string;
  resInoculationAgency: string;
  resVaccineNm: string;
  commBrandName: string;
  resLOTNumber: string;
}
