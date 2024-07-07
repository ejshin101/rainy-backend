export class SendEmailVerDto {
  constructor(userSno: number, emailVerCd: string) {
    this.userSno = userSno;
    this.emailVerCd = emailVerCd;
  }

  userSno: number;
  emailVerCd: string;
}
