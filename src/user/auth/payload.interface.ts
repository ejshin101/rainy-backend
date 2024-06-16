import UserCodeEnum from '../../common/enum/user/UserCode.enum';

export class Payload {
  userSno: number;
  userEmail: string;
  userCd?: UserCodeEnum;
}
