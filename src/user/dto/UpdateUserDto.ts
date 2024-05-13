import UserCodeEnum from "../../common/enum/user/UserCode.enum";
import TrueFalseCodeEnum from "../../common/enum/TrueFalseCode.enum";
import UserStatusCodeEnum from "../../common/enum/user/UserStatusCode.enum";

export class UpdateUserDto {
    constructor(
        userNm: string,
        userEmail: string,
        userPswd: string,
        userUseTf: TrueFalseCodeEnum,
        userCd: UserCodeEnum,
        userStatCd: UserStatusCodeEnum
    ) {
        this.USER_NM = userNm;
        this.USER_EMAIL = userEmail;
        this.USER_PSWD = userPswd;
        this.USER_USE_TF = userUseTf;
        this.USER_CD = userCd;
        this.USER_STAT_CD = userStatCd;
    }

    USER_NM: string;
    USER_EMAIL: string;
    USER_PSWD: string;
    USER_USE_TF: TrueFalseCodeEnum;
    USER_CD: UserCodeEnum;
    USER_STAT_CD: UserStatusCodeEnum;
}
