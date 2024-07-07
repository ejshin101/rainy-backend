export class EmailVerResponseDto {
  constructor(
    userSno: number,
    emailVerCd: string,
    crteDtt: Date,
    exprDtt: Date,
  ) {
    this.userSno = userSno;
    this.emailVerCd = emailVerCd;
    this.crteDtt = crteDtt;
    this.exprDtt = exprDtt;
  }

  emailVerSno: number;
  userSno: number;
  emailVerCd: string;
  crteDtt: Date;
  exprDtt: Date;
}
