export class CreatePlntJrnlDto {
  constructor(
    userPlntSno: number,
    plntJrnlDt: Date,
    plntJrnlTtle: string,
    plntJrnlCtnt: string,
  ) {
    this.userPlntSno = userPlntSno;
    this.plntJrnlDt = plntJrnlDt;
    this.plntJrnlTtle = plntJrnlTtle;
    this.plntJrnlCtnt = plntJrnlCtnt;
  }

  readonly userPlntSno: number;
  readonly plntJrnlDt: Date;
  readonly plntJrnlTtle: string;
  readonly plntJrnlCtnt: string;
}
