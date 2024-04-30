import { CodefResponse } from '../../types/common/codef.response';
import { VaccinationResponse, VaccineData } from '@vacgom/types';
import { Identity } from '../../utils/identity.model';
import { formatDate } from '../../utils/date';

export class VaccinationRecordResponse extends CodefResponse<CodefMyVaccinationData> {
  public toVaccinationResponse(): VaccinationResponse {
    const userIdentity = Identity.ofIdentityString(this.data.resUserIdentiyNo);

    const vaccinations = this.data.resVaccineList
      .filter((vaccine) => {
        return vaccine.resDetailList.length > 0;
      })
      .flatMap((vaccine) => {
        return vaccine.resDetailList.map((detail): VaccineData => {
          return {
            vaccineType: vaccine.resVaccineNm,
            inoculationOrder: parseInt(vaccine.resInoculationOrder),
            inoculationOrderString: detail.resInoculationOrder,
            date: formatDate(detail.resInoculationDate),
            agency: detail.resInoculationAgency,
            vaccineName: detail.resVaccineNm,
            vaccineBrandName: detail.commBrandName,
            lotNumber: detail.resLOTNumber,
          };
        });
      });

    return {
      vaccinationIdentity: {
        name: this.data.resUserNm,
        birth: userIdentity.date,
        sex: userIdentity.sex,
      },
      vaccineList: vaccinations,
    };
  }
}

export class CodefMyVaccinationData {
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
