import { IsNumber, IsOptional } from 'class-validator';

export class pagingRequestDto {
  @IsNumber()
  @IsOptional()
  pageNo?: number = 1;
  @IsNumber()
  @IsOptional()
  pageSize?: number = 10;

  getOffset(): number {
    if (this.pageNo < 1 || this.pageNo === null || this.pageNo === undefined) {
      this.pageNo = 1;
    }

    if (
      this.pageSize < 1 ||
      this.pageSize === null ||
      this.pageSize === undefined
    ) {
      this.pageSize = 10;
    }
    return (this.pageNo - 1) * this.pageSize;
  }
}
