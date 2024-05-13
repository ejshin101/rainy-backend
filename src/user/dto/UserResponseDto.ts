export class UserResponseDto {
    constructor(
        userSno: number,
        userNm: string,
        userEmail: string,
        userCd: string,
        userStatCd: string,
        delTf: string
    ) {
        this.USER_SNO = userSno;
        this.USER_NM = userNm;
        this.USER_EMAIL = userEmail;
        this.USER_CD = userCd;
        this.USER_STAT_CD = userStatCd;
        this.DEL_TF = delTf;
    }

    USER_SNO: number;
    USER_NM: string;
    USER_EMAIL: string;
    USER_CD: string;
    USER_STAT_CD: string;
    DEL_TF: string;
}