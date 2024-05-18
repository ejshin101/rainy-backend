export class CreateUserPlntDto {
  constructor(
    userPlntsno: number,
    userPlntNm: string,
    plntTypeSno: number,
    plntAdptDt: Date,
    plntAdptPrice: number,
    plntAdptLctnNm: string,
    plntDesc: string,
    userSno: number,
  ) {
    this.userPlntNm = userPlntNm;
    this.plntTypeSno = plntTypeSno;
    this.plntAdptDt = plntAdptDt;
    this.plntAdptPrice = plntAdptPrice;
    this.plntAdptLctnNm = plntAdptLctnNm;
    this.plntDesc = plntDesc;
    this.userSno = userSno;
  }
  readonly userPlntNm: string;
  readonly plntTypeSno: number;
  readonly plntAdptDt: Date;
  readonly plntAdptPrice: number;
  readonly plntAdptLctnNm: string;
  readonly plntDesc: string;
  readonly userSno: number;
}