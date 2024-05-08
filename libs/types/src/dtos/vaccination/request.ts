import * as t from 'io-ts';

export const VaccinationRequest = t.type({
  id: t.string,
  password: t.string,
});

export type VaccinationRequest = t.TypeOf<typeof VaccinationRequest>;
