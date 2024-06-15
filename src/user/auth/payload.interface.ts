import UserCodeEnum from '../../common/enum/user/UserCode.enum';

export class Payload {
  USER_SNO: number;
  USER_EMAIL: string;
  USER_CD?: UserCodeEnum;
}
