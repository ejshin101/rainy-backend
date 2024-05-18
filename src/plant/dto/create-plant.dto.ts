import { pagingRequestDto } from '../../common/dto/pagingRequest.dto';

export class CreatePlantDto extends pagingRequestDto {
  constructor(plntTypeSno: number, plntTypeKor: string = '') {
    super();
    this.plntTypeSno = plntTypeSno;
    this.plntTypeKor = plntTypeKor;
  }

  readonly plntTypeSno: number;
  readonly plntTypeKor: string;
}
