export class CreatePlantDto {
  constructor(PLNT_TYPE_KOR: string, PLNT_TYPE_ENG: string) {
    this.PLNT_TYPE_KOR = PLNT_TYPE_KOR;
    this.PLNT_TYPE_ENG = PLNT_TYPE_ENG;
  }

  readonly PLNT_TYPE_KOR: string;
  readonly PLNT_TYPE_ENG: string;
}
