import { DateTimeFormatter, LocalDate } from 'js-joda';
import { IdentityParser } from './identityParser';
import { FullRnnParser } from './parsers/full-rnn';
import { PartialRnnParser } from './parsers/partial-rnn';
import { FullBirthdayParser } from './parsers/full-birthday';
import { InvalidIdentityStringException } from './exceptions/InvalidIdentityStringException';

export class Identity {
  private birthDate!: LocalDate; //생년월일
  private rnnSecret?: string; //주민등록번호 뒷자리
  private rnnSexChar?: string; //주민등록번호 성별 문자

  constructor(birthDate: LocalDate, rnnSecret?: string, rnnSexChar?: string) {
    this.birthDate = birthDate;
    this.rnnSecret = rnnSecret;
    this.rnnSexChar = rnnSexChar;
  }

  static parse(identityString: string): Identity {
    const parsers: IdentityParser[] = [
      new FullRnnParser(),
      new PartialRnnParser(),
      new FullBirthdayParser(),
    ];

    const identity = parsers
      .map((parser) => {
        try {
          return parser.toIdentity(identityString);
        } catch (e) {
          return null;
        }
      })
      .find((identity) => identity);

    if (!identity) throw new InvalidIdentityStringException();

    return identity;
  }

  to6DigitBirthDateString(): string {
    return this.birthDate.format(DateTimeFormatter.ofPattern('yyMMdd'));
  }

  to9DigitRnnString(): string {
    return (
      this.birthDate.format(DateTimeFormatter.ofPattern('yyyyMMdd')) +
      this.rnnSexChar
    );
  }

  toFullBirthDateString(): string {
    return this.birthDate.format(DateTimeFormatter.ofPattern('yyyyMMdd'));
  }

  getSex(): 'M' | 'F' {
    return this.rnnSexChar === '1' || this.rnnSexChar === '3' ? 'M' : 'F';
  }

  toString(): string {
    const birthDateString = this.birthDate.format(
      DateTimeFormatter.ofPattern('yyMMdd')
    );

    if (this.rnnSecret) {
      return `${birthDateString}-${this.rnnSecret}`;
    } else if (this.rnnSexChar) {
      return `${birthDateString}-${this.rnnSexChar}`;
    } else {
      return `${birthDateString}`;
    }
  }
}
