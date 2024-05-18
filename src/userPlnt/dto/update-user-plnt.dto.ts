export class UpdateUserPlntDto {
  constructor(
    userPlntsno: number,
    userPlntNm: string,
    plntTypeSno: number,
    plntAdptDt: Date,
    plntAdptPrice: number,
    plntAdptLctnNm: string,
    plntDesc: string,
  ) {
    this.userPlntNm = userPlntNm;
    this.plntTypeSno = plntTypeSno;
    this.plntAdptDt = plntAdptDt;
    this.plntAdptPrice = plntAdptPrice;
    this.plntAdptLctnNm = plntAdptLctnNm;
    this.plntDesc = plntDesc;
  }
  readonly userPlntNm: string;
  readonly plntTypeSno: number;
  readonly plntAdptDt: Date;
  readonly plntAdptPrice: number;
  readonly plntAdptLctnNm: string;
  readonly plntDesc: string;
}
