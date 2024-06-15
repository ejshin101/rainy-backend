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
        this.userNm = userNm;
        this.userEmail = userEmail;
        this.userPswd = userPswd;
        this.userUseTf = userUseTf;
        this.userCd = userCd;
        this.userStatCd = userStatCd;
    }

    userNm: string;
    userEmail: string;
    userPswd: string;
    userUseTf: TrueFalseCodeEnum;
    userCd: UserCodeEnum;
    userStatCd: UserStatusCodeEnum;
}
