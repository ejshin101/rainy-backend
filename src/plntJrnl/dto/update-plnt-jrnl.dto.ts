export class UpdatePlntJrnlDto {
  constructor(
    plntJrnlDt: Date,
    plntJrnlTtle: string,
    plntJrnlCtnt: string,
  ) {
    this.plntJrnlDt = plntJrnlDt;
    this.plntJrnlTtle = plntJrnlTtle;
    this.plntJrnlCtnt = plntJrnlCtnt;
  }
  readonly plntJrnlDt: Date;
  readonly plntJrnlTtle: string;
  readonly plntJrnlCtnt: string;
}
