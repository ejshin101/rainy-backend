import UserCodeEnum from '../../common/enum/user/UserCode.enum';
import { SetMetadata } from '@nestjs/common';

export const Roles = (role: UserCodeEnum): any => SetMetadata('roles', role);
