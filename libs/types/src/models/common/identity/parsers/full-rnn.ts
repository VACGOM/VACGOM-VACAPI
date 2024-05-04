import { IdentityParser } from '../identityParser';
import { Identity } from '@vacgom/types';
import { LocalDate } from 'js-joda';
import { toCompleteYear } from '../util';

export class FullRnnParser implements IdentityParser {
  private regex = /^(?:\d{2})?(\d{2})(\d{2})(\d{2})-?(\d{7})$/g;

  toIdentity(identityString: string): Identity {
    const matches = [...identityString.matchAll(this.regex)][0];
    if (!matches || matches.length !== 5) {
      throw new Error('Invalid identity string');
    }

    const rnnSexChar = matches[4].charAt(0);

    return new Identity(
      LocalDate.of(
        parseInt(toCompleteYear(matches[1], rnnSexChar)),
        parseInt(matches[2]),
        parseInt(matches[3])
      ),
      matches[4],
      rnnSexChar
    );
  }
}
