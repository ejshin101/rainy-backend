import UserCodeEnum from '../../common/enum/user/UserCode.enum';

export class UserAuthDto {
  constructor(
    userSno: number,
    userNm: string,
    userEmail: string,
    userPswd: string,
    userUseTf: string,
    userCd: UserCodeEnum,
    userStatCd: string,
    delTf: string,
    refreshToken: string,
    refreshTokenExp: Date,
  ) {
    this.userSno = userSno;
    this.userNm = userNm;
    this.userEmail = userEmail;
    this.userPswd = userPswd;
    this.userUseTf = userUseTf;
    this.userCd = userCd;
    this.userStatCd = userStatCd;
    this.delTf = delTf;
    this.refreshToken = refreshToken;
    this.refreshTokenExp = refreshTokenExp;

  }

  userSno: number;
  userNm: string;
  userEmail: string;
  userPswd: string;
  userUseTf: string;
  userCd: UserCodeEnum;
  userStatCd: string;
  delTf: string;
  refreshToken: string;
  refreshTokenExp: Date;
}
