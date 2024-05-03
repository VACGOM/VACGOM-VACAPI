import { LocalDate } from 'js-joda';
import { InvalidRnnSecretException } from '../../exceptions/InvalidRnnSecretException';

export class Identity {
  private birthDate!: LocalDate; //생년월일
  private rnnSecret?: string; //주민등록번호 뒷자리
  private rnnSex?: 'M' | 'F';

  constructor(birthDate: LocalDate, rnnSecret?: string) {
    this.birthDate = birthDate;
    this.rnnSecret = rnnSecret;
  }

  static fromRnnString(rnn: string): Identity {
    const matches = rnn.match(/(\d{6})-*(\d{7})/g);
    if (!matches || matches.length != 2) throw new InvalidRnnSecretException();

    const birthDate = LocalDate.parse(matches[0]);
    const rnnSecret = matches[1];

    return new Identity(birthDate, rnnSecret);
  }

  static isBornIn1900s(rnnSecret: string): boolean {
    if (rnnSecret.startsWith('1') || rnnSecret.startsWith('2')) return true;
    else return false;
  }

  static fromPartialRnnString(partialRnn: string): Identity {
    //partialRnn : 030912-3 or 0309123

    const matches = partialRnn.match(/(\d{6})-*(\d)/);
    console.log(matches);
    if (!matches) throw new InvalidRnnSecretException();

    const bornIn1900s = this.isBornIn1900s(matches[2]);

    const birthDateString = `${bornIn1900s ? '19' : '20'}${matches[1]}`;
    const year = parseInt(birthDateString.slice(0, 4));
    const month = parseInt(birthDateString.slice(4, 6));
    const day = parseInt(birthDateString.slice(6, 8));

    const birthDate = LocalDate.of(year, month, day);

    return new Identity(birthDate, matches[2]);
  }

  to9DigitIdentity(): string {
    return `${this.birthDate.toString().replace('/-/g', '')}${this.rnnSecret}`;
  }
}
