import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { executeResponseDto } from '../../common/dto/executeResponse.dto';
import { JwtService } from '@nestjs/jwt';
import { UserAuthDto } from '../dto/UserAuthDto';
import * as bcrypt from 'bcrypt';
import { Payload } from './payload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import ResponseCodeEnum from '../../common/enum/ResponseCode.enum';
import { UpdateUserDto } from '../dto/UpdateUserDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(user: UpdateUserDto): Promise<executeResponseDto> {
    const userFind: UserAuthDto = await this.userService.findByEmail(
      user.userEmail,
    );

    return await this.userService.updateUser(userFind.userSno, user);
  }

  async duplicates(userEmail: string): Promise<executeResponseDto> {
    const userFind: UserAuthDto = await this.userService.findByEmail(userEmail);

    if (userFind) {
      return new executeResponseDto(ResponseCodeEnum.alreadyUsed, 0);
    }

    return new executeResponseDto(ResponseCodeEnum.success, 1);
  }

  async login(
    user: UserAuthDto,
  ): Promise<{ accessToken: string } | ResponseCodeEnum> {
    const userFind = await this.userService.findByEmail(user.userEmail);
    const validatePassword = await bcrypt.compare(
      user.userPswd,
      userFind.userPswd,
    );
    if (!userFind || !validatePassword) {
      return ResponseCodeEnum.badRequest;
    }

    const payload: Payload = {
      userSno: userFind.userSno,
      userEmail: userFind.userEmail,
      userCd: userFind.userCd,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }

  async tokenValidateUser(payload: Payload): Promise<UserAuthDto | undefined> {
    return await this.userService.findByEmail(payload.userEmail);
  }

  async validateUser(
    user: UserAuthDto,
  ): Promise<UserAuthDto | ResponseCodeEnum> {
    const userFind = await this.userService.findByEmail(user.userEmail);

    if (!userFind) {
      return ResponseCodeEnum.badRequest;
    }

    if (!(await bcrypt.compare(user.userPswd, userFind.userPswd))) {
      return ResponseCodeEnum.badRequest;
    }

    return userFind;
  }

  async generateAccessToken(user: UserAuthDto): Promise<string> {
    const payload: Payload = {
      userSno: user.userSno,
      userEmail: user.userEmail,
      userCd: user.userCd,
    };
    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(user: UserAuthDto): Promise<string> {
    const payload: Payload = {
      userSno: user.userSno,
      userEmail: user.userEmail,
      userCd: user.userCd,
    };
    return this.jwtService.signAsync(
      { userSno: payload.userSno },
      {
        secret: 'JWT_REFRESH_SECRET',
        expiresIn: 86400, //1day
      },
    );
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string } | any> {
    const { refreshToken } = refreshTokenDto;

    const decodedRefreshToken = this.jwtService.verify(refreshToken, {
      secret: 'JWT_REFRESH_SECRET',
    }) as Payload;

    const userSno = decodedRefreshToken.userSno;
    const user = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      userSno,
    );

    console.log('user');
    console.log(user!);

    if (!user) {
      return {
        accessToken: '',
      };
    } else {
      const accessToken = await this.generateAccessToken(user);

      return { accessToken };
    }
  }

  //회원탈퇴
  async resign(
    user: UserAuthDto,
  ): Promise<executeResponseDto | ResponseCodeEnum> {
    const userFind = await this.userService.findByEmail(user.userEmail);
    if (!userFind) {
      return new executeResponseDto(ResponseCodeEnum.badRequest, 0);
    }

    if (!(await bcrypt.compare(user.userPswd, userFind.userPswd))) {
      return new executeResponseDto(ResponseCodeEnum.badRequest, 0);
    }

    return await this.userService.delete(userFind.userSno);
  }
}
