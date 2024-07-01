import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { executeResponseDto } from '../../common/dto/executeResponse.dto';
import { CreateUserDto } from '../dto/CreateUserDto';
import { JwtService } from '@nestjs/jwt';
import { UserAuthDto } from '../dto/UserAuthDto';
import * as bcrypt from 'bcrypt';
import { Payload } from './payload.interface';
import { ConfigService } from '@nestjs/config';
import process from 'process';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(user: CreateUserDto): Promise<executeResponseDto> {
    const userFind: UserAuthDto = await this.userService.findByEmail(
      user.userEmail,
    );

    //코드 정해서 하기
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
      userSno: userFind.userSno,
      userEmail: userFind.userEmail,
      userCd: userFind.userCd,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }

  async tokenValidateUser(payload: Payload): Promise<UserAuthDto | undefined> {
    return await this.userService.findByEmail(payload.userEmail);
  }

  ////////
  async validateUser(user: UserAuthDto): Promise<UserAuthDto> {
    const userFind = await this.userService.findByEmail(user.userEmail);

    if (!userFind) {
      throw new NotFoundException('User not found!');
    }

    if (!(await bcrypt.compare(user.userPswd, userFind.userPswd))) {
      throw new BadRequestException('Invalid credentials!');
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
        // secret: this.configService.get<string>(process.env.JWT_REFRESH_SECRET),
        secret: 'JWT_REFRESH_SECRET',
        // expiresIn: this.configService.get<string>(
        //   process.env.JWT_REFRESH_EXPIRE,
        // ),
        expiresIn: 86400, //1day
      },
    );
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshTokenDto;

    const decodedRefreshToken = this.jwtService.verify(refreshToken, {
      // secret: process.env.JWT_REFRESH_SECRET,
      secret: 'JWT_REFRESH_SECRET',
    }) as Payload;

    const userSno = decodedRefreshToken.userSno;
    const user = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      userSno,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    const accessToken = await this.generateAccessToken(user);
    return { accessToken };
  }
}
