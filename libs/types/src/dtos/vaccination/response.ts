export type VaccinationResponse = {
  vaccinationIdentity?: VaccinationIdentity;
  vaccineList: VaccineData[];
};

export type VaccinationIdentity = {
  name: string;
  birth: string;
  sex: string;
};

export type VaccineData = {
  vaccineType: string;
  inoculationOrder: number;
  inoculationOrderString: string;
  date: string;
  agency: string;
  vaccineName?: string;
  vaccineBrandName?: string;
  lotNumber?: string;
};
