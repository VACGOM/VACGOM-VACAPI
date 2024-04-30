export class VaccinationResponse {
  vaccinationIdentity?: VaccinationIdentity;
  vaccineList!: VaccineData[];
}

export class VaccinationIdentity {
  name!: string;
  birth!: string;
  sex!: string;
}

export class VaccineData {
  vaccineType!: string;
  inoculationOrder!: number;
  inoculationOrderString!: string;
  date!: string;
  agency!: string;
  vaccineName?: string;
  vaccineBrandName?: string;
  lotNumber?: string;
}
