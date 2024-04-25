export class pagingRequestDto {
    page: Number;
    pageSize: Number;

    constructor(page: Number, pageSize: Number) {
        this.page = page;
        this.pageSize = pageSize;
    }
}
