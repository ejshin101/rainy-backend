export class CodeCheckEmailVerDto {
  constructor(userEmail: string, emailVerCd: string) {
    this.userEmail = userEmail;
    this.emailVerCd = emailVerCd;
  }

  userEmail: string;
  emailVerCd: string;
}
