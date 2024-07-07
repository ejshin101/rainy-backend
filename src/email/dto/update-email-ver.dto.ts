export class UpdateEmailVerDto {
  constructor(emailVerCd: string) {
    this.emailVerCd = emailVerCd;
  }

  emailVerCd: string;
}
