import * as t from 'io-ts';
import { CodefResponse } from '../common/codef.response';

export const CodefMyVaccinationResponse = CodefResponse(
  t.type({
    resUserNm: t.string,
    resUserIdentiyNo: t.string,
    resVaccineList: t.array(
      t.type({
        resEpidemicType: t.string,
        resEpidemicNm: t.string,
        resVaccineNm: t.string,
        resInoculationOrder: t.string,
        resDetailList: t.array(
          t.type({
            resVaccinationNm: t.string,
            resInoculationOrder: t.string,
            resInoculationDate: t.string,
            resInoculationAgency: t.string,
            resVaccineNm: t.string,
            commBrandName: t.string,
            resLOTNumber: t.string,
          })
        ),
      })
    ),
  })
);

export type CodefMyVaccinationResponse = t.TypeOf<
  typeof CodefMyVaccinationResponse
>;
