// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class executeResponseDto {
  responseCode: string;
  successCnt: number;

  constructor(responseCode: string, successCnt: number) {
    this.responseCode = responseCode;
    this.successCnt = successCnt;
  }
}
