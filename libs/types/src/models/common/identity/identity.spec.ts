import { Identity } from '@vacgom/types';
import { InvalidIdentityStringException } from './exceptions/InvalidIdentityStringException';

describe('Identity', () => {
  test('can parse full rnn string', () => {
    const rnnStrings = ['030912-3111111', '0309123111111'];

    for (const rnnString of rnnStrings) {
      const identity = Identity.parse(rnnString);
      expect(identity.toString()).toBe('030912-3111111');
      expect(identity.to6DigitBirthDateString()).toBe('030912');
      expect(identity.toFullBirthDateString()).toBe('20030912');
      expect(identity.getSex()).toBe('M');
    }
  });

  test('can parse partial rnn string', () => {
    const rnnStrings = ['030912-3', '0309123', '200309123', '20030912-3'];

    for (const rnnString of rnnStrings) {
      const identity = Identity.parse(rnnString);
      expect(identity.toString()).toBe('030912-3');
      expect(identity.to6DigitBirthDateString()).toBe('030912');
      expect(identity.toFullBirthDateString()).toBe('20030912');
      expect(identity.getSex()).toBe('M');
    }
  });

  test('can parse full birthday string', () => {
    const birthdayString = '20030912';

    const identity = Identity.parse(birthdayString);
    expect(identity.toString()).toBe('030912');
    expect(identity.to6DigitBirthDateString()).toBe('030912');
    expect(identity.toFullBirthDateString()).toBe('20030912');
  });

  test('should throw InvalidIdentityStringException when provided with invalid identity string', () => {
    const birthdayString = '030912';

    try {
      const identity = Identity.parse(birthdayString);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidIdentityStringException);
    }
  });
});
