export type TwoWayInfo = {
  jobIndex: number;
  threadIndex: number;
  jti: string;
  twoWayTimestamp: string;
};

export class RequestInfo<T> {
  public data: T | undefined;
  public twoWayInfo?: TwoWayInfo;

  constructor(data?: T, twoWayInfo?: TwoWayInfo) {
    this.data = data;
    this.twoWayInfo = twoWayInfo;
  }

  public getData(): T | undefined {
    return this.data;
  }

  public getTwoWayInfo(): TwoWayInfo | undefined {
    return this.twoWayInfo;
  }

  public setData(data: T) {
    this.data = { ...data };
  }

  public setTwoWayInfo(twoWayInfo: TwoWayInfo) {
    this.twoWayInfo = twoWayInfo;
  }
}

//RequestData + twoWayInfo
