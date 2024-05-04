import { Telecom } from '@vacgom/types';

describe('Telecom', () => {
  it('should be created from valid telecom string', () => {
    const validTelecomString = [
      'SKT',
      'KT',
      'LG',
      'SKT_MVNO',
      'KT_MVNO',
      'LG_MVNO',
    ];

    validTelecomString.forEach((telecomString) => {
      expect(() => Telecom.fromString(telecomString)).not.toThrow();
    });
  });

  it('should not be created from numeric keys', () => {
    const invalidTelecomString = ['0', '1', '2', '3', '4', '5'];

    invalidTelecomString.forEach((telecomString) => {
      expect(() => Telecom.fromString(telecomString)).toThrow();
    });
  });

  it('should not be created from invalid telecom string', () => {
    const invalidTelecomString = ['INVALID', 'ATNT'];

    invalidTelecomString.forEach((telecomString) => {
      expect(() => Telecom.fromString(telecomString)).toThrow();
    });
  });

  it('should return correct value', () => {
    const telecom = Telecom.fromString('SKT');
    expect(telecom.getValue()).toBe(0);
  });

  it('should return correct string', () => {
    const telecom = Telecom.fromString('SKT');
    expect(telecom.toString()).toBe('SKT');
  });
});
