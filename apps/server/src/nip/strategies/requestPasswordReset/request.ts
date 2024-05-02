import { Identity, Telecom } from '@vacgom/types';

export class ResetPasswordRequest {
  name!: string;
  identity!: Identity;
  newPassword!: string;
  telecom!: Telecom;
  phoneNumber!: string;
}
