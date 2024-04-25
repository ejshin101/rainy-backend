export class executeResponseDto<T> {
    responseCode: String;
    successCnt: Number;

    constructor(responseCode: String, successCnt: Number) {
        this.responseCode = responseCode;
        this.successCnt = successCnt;
    }
}
