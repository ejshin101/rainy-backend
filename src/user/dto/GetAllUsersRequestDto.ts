import { pagingRequestDto } from '../../common/dto/pagingRequest.dto';

export class GetAllUsersRequestDto extends pagingRequestDto {
  constructor(keyword: string = '') {
    super();
    this.keyword = keyword;
  }

  keyword: string;
}
