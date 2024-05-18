export class UpdateUserPlntDto {
  constructor(
    userPlntNm: string,
    plntTypeSno: number,
    plntAdptDt: Date,
    plntAdptPrice: number,
    plntAdptLctnNm: string,
    plntDesc: string,
    editDtt: string = new Date(+new Date() + 3240 * 10000)
      .toISOString()
      .replace('T', ' ')
      .replace(/\..*/, ''),
  ) {
    this.userPlntNm = userPlntNm;
    this.plntTypeSno = plntTypeSno;
    this.plntAdptDt = plntAdptDt;
    this.plntAdptPrice = plntAdptPrice;
    this.plntAdptLctnNm = plntAdptLctnNm;
    this.plntDesc = plntDesc;
    this.editDtt = editDtt;
  }
  readonly userPlntNm: string;
  readonly plntTypeSno: number;
  readonly plntAdptDt: Date;
  readonly plntAdptPrice: number;
  readonly plntAdptLctnNm: string;
  readonly plntDesc: string;
  private editDtt: string;
}
