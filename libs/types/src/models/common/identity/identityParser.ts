import { Identity } from '@vacgom/types';

export interface IdentityParser {
  toIdentity(identityString: string): Identity;
}
