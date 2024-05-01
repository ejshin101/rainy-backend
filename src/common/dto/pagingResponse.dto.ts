export class pagingResponseDto<T> {
  responseCode: string;
  pageNo: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  resultData: T[];

  constructor(
    responseCode: string,
    totalCount: number,
    pageNo: number,
    pageSize: number,
    resultData: T[],
  ) {
    this.responseCode = responseCode;
    this.pageNo = pageNo;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.totalPage = Math.ceil(totalCount / pageSize);
    this.hasPreviousPage = this.pageNo > 1;
    this.hasNextPage = this.pageNo < this.totalPage;
    this.resultData = resultData;
  }
}
