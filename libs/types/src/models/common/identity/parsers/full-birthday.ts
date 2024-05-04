import { IdentityParser } from '../identityParser';
import { Identity } from '@vacgom/types';
import { LocalDate } from 'js-joda';

export class FullBirthdayParser implements IdentityParser {
  private regex = /^(\d{4})(\d{2})(\d{2})$/g;

  toIdentity(identityString: string): Identity {
    const matches = [...identityString.matchAll(this.regex)][0];
    if (!matches || matches.length !== 4) {
      throw new Error('Invalid identity string');
    }

    return new Identity(
      LocalDate.of(
        parseInt(matches[1]),
        parseInt(matches[2]),
        parseInt(matches[3])
      )
    );
  }
}
