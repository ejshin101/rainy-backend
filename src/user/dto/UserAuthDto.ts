import UserCodeEnum from '../../common/enum/user/UserCode.enum';

export class UserAuthDto {
  constructor(
    userSno: number,
    userNm: string,
    userEmail: string,
    userPswd: string,
    userCd: UserCodeEnum,
    userStatCd: string,
    delTf: string,
  ) {
    this.userSno = userSno;
    this.userNm = userNm;
    this.userEmail = userEmail;
    this.userPswd = userPswd;
    this.userCd = userCd;
    this.userStatCd = userStatCd;
    this.delTf = delTf;
  }

  userSno: number;
  userNm: string;
  userEmail: string;
  userPswd: string;
  userCd: UserCodeEnum;
  userStatCd: string;
  delTf: string;
}
