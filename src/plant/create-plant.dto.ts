export class CreatePlantDto {
  constructor(PLNT_TYPE_KOR: string) {
    this.PLNT_TYPE_KOR = PLNT_TYPE_KOR;
  }

  readonly PLNT_TYPE_KOR: string;
}
