import { pagingRequestDto } from '../../common/dto/pagingRequest.dto';

export class PlntJrnlResponseDto extends pagingRequestDto {
  constructor(plntJrnlTtle: string = '', plntJrnlCtnt: string = '') {
    super();
    this.plntJrnlTtle = plntJrnlTtle;
    this.plntJrnlCtnt = plntJrnlCtnt;
  }
  readonly plntJrnlTtle: string;
  readonly plntJrnlCtnt: string;
}
