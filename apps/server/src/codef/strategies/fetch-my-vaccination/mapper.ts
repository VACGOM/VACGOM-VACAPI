import { Injectable } from '@nestjs/common';
import { VaccinationRequest, VaccinationResponse } from '@vacgom/types';
import { CodefMyVaccinationRequest } from '../../types/vaccination/vaccination.request';
import { CodefMyVaccinationResponse } from '../../types/vaccination/vaccination.response';
import { formatDate } from '../../utils/date';

@Injectable()
export class FetchMyVaccinationMapper {
  public toCodefRequest(
    request: VaccinationRequest
  ): CodefMyVaccinationRequest {
    return {
      organization: '0011',
      loginType: '1',
      userId: request.id,
      userPassword: request.password,
      inquiryType: '0',
    };
  }

  public toResponse(
    codefResponse: CodefMyVaccinationResponse
  ): VaccinationResponse {
    return {
      vaccinationIdentity: {
        name: codefResponse.data.resUserNm,
        birth: codefResponse.data.resUserIdentiyNo,
        sex: codefResponse.data.resUserIdentiyNo,
      },
      vaccineList: codefResponse.data.resVaccineList
        .filter((vaccine) => {
          return vaccine.resDetailList.length > 0;
        })
        .flatMap((vaccine) => {
          return vaccine.resDetailList.map((detail) => {
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
        }),
    };
  }
}
