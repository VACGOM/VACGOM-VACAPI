export class ContextOutputDto {
  stateType!: string;
  memberId!: string;
  requestInfo!: RequestInfoOutputDto;
  secureNoImage?: string;
}

export class RequestInfoOutputDto {
  name!: string;
  identity!: string;
  newPassword!: string;
  telecom!: string;
  phoneNumber!: string;

  twoWayInfo?: {
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: string;
  };
}
