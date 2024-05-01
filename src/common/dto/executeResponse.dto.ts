// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class executeResponseDto<T> {
  responseCode: string;
  successCnt: number;

  constructor(responseCode: string, successCnt: number) {
    this.responseCode = responseCode;
    this.successCnt = successCnt;
  }
}
