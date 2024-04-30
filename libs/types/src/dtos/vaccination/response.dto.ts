export class MyVaccinationResponse {
  name!: string
  birth!: string
  sex!: string
  vaccineList!: VaccineData[]
}

export class VaccineData {
  vaccineType!: string
  inoculationOrder!: number
  inoculationOrderString!: string
  date!: string
  agency!: string
  vaccineName?: string
  vaccineBrandName?: string
  lotNumber?: string
}
