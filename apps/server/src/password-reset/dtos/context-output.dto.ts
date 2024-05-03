export class ContextOutputDto {
  stateType!: string;
  memberId!: string;
  requestInfo!: RequestInfoOutputDto;
}

export class RequestInfoOutputDto {
  name!: string;
  identity!: string;
  newPassword!: string;
  telecom!: string;
  phoneNumber!: string;

  twoWayInfo?: {
    isTwoWay: boolean;
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: number;
  };
}
