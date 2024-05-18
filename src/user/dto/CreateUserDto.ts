import UserCodeEnum from "../../common/enum/user/UserCode.enum";

export class CreateUserDto {
    constructor(
        userNm: string,
        userEmail: string,
        userPswd: string,
        userCd: UserCodeEnum
    ) {
        this.userNm = userNm;
        this.userEmail = userEmail;
        this.userPswd = userPswd;
        this.userCd = userCd;
    }

    userNm: string;
    userEmail: string;
    userPswd: string;
    userCd: UserCodeEnum;
}
