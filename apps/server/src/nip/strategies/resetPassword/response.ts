import { TwoWayInfo } from './request';

export class SecureNoResponse {
  constructor(public secureNoImage: string, public twoWayInfo: TwoWayInfo) {}
}

export class SMSResponse {
  constructor(public twoWayInfo: TwoWayInfo) {}
}
