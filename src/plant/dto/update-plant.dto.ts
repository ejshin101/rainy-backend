export class UpdatePlantDto {
  constructor(plntTypeKor: string) {
    this.plntTypeKor = plntTypeKor;
  }

  readonly plntTypeKor: string;
}
