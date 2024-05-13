import UserCodeEnum from "../../common/enum/user/UserCode.enum";

export class CreateUserDto {
    constructor(
        userNm: string,
        userEmail: string,
        userPswd: string,
        userCd: UserCodeEnum
    ) {
        this.USER_NM = userNm;
        this.USER_EMAIL = userEmail;
        this.USER_PSWD = userPswd;
        this.USER_CD = userCd;
    }

    USER_NM: string;
    USER_EMAIL: string;
    USER_PSWD: string;
    USER_CD: UserCodeEnum;
}
