export class VaccinationRecordRequest {
  public organization = '0011';
  public loginType = '1';
  public userId: string;
  public userPassword: string;
  public inquiryType = '0';

  constructor(id: string, password: string) {
    this.userId = id;
    this.userPassword = password;
  }
}
