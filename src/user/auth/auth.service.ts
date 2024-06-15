import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { executeResponseDto } from '../../common/dto/executeResponse.dto';
import { CreateUserDto } from '../dto/CreateUserDto';
import { JwtService } from '@nestjs/jwt';
import { UserAuthDto } from '../dto/UserAuthDto';
import * as bcrypt from 'bcrypt';
import { Payload } from './payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(user: CreateUserDto): Promise<executeResponseDto> {
    const userFind: UserAuthDto = await this.userService.findByEmail(
      user.userEmail,
    );
    if (userFind) {
      throw new HttpException(
        'User Email already used!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.userService.create(user);
  }

  async login(user: UserAuthDto): Promise<{ accessToken: string } | undefined> {
    const userFind = await this.userService.findByEmail(user.userEmail);
    const validatePassword = await bcrypt.compare(
      user.userPswd,
      userFind.userPswd,
    );
    if (!userFind || !validatePassword) {
      throw new UnauthorizedException();
    }

    const payload: Payload = {
      USER_SNO: userFind.userSno,
      USER_EMAIL: userFind.userEmail,
      USER_CD: userFind.userCd,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }

  async tokenValidateUser(payload: Payload): Promise<UserAuthDto | undefined> {
    return await this.userService.findByEmail(payload.USER_EMAIL);
  }
}
