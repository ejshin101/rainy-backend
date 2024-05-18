export class UserResponseDto {
    constructor(
        userSno: number,
        userNm: string,
        userEmail: string,
        userCd: string,
        userStatCd: string,
        delTf: string
    ) {
        this.userSno = userSno;
        this.userNm = userNm;
        this.userEmail = userEmail;
        this.userCd = userCd;
        this.userStatCd = userStatCd;
        this.delTf = delTf;
    }

    userSno: number;
    userNm: string;
    userEmail: string;
    userCd: string;
    userStatCd: string;
    delTf: string;
}