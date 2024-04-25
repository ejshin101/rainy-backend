export class pagingResponseDto<T> {
    responseCode: String;
    page: Number;
    pageSize: Number;
    successCnt: Number;
    totalCnt: Number;
    resultData: T[];

    constructor() { }
}
