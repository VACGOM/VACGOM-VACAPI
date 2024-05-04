enum TelecomType {
  SKT = 0,
  KT = 1,
  LG = 2,
  SKT_MVNO = 3,
  KT_MVNO = 4,
  LG_MVNO = 5,
}

export class Telecom {
  private value: TelecomType;

  private constructor(value: TelecomType) {
    this.value = value;
  }

  static fromString(value: string): Telecom {
    const type = <keyof typeof TelecomType>value;

    const keys = Object.keys(TelecomType).filter((key) => isNaN(Number(key)));
    const telecom = keys.includes(value) ? TelecomType[type] : null;

    if (telecom == null) throw new Error('Invalid Telecom Type');

    return new Telecom(TelecomType[type]);
  }

  toString(): string {
    return TelecomType[this.value];
  }

  getValue(): number {
    return this.value;
  }
}
