import {
  Body,
  Controller,
  Delete,
  Get,
  Post, Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/CreateUserDto';
import { executeResponseDto } from '../../common/dto/executeResponse.dto';
import { UserAuthDto } from '../dto/UserAuthDto';
import { Response } from 'express';
import { JwtAccessGuard } from './jwt-access.guard';
import { UserService } from '../user.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { PublicDecorator } from '../../common/public.decorator';
import { UserResponseDto } from '../dto/UserResponseDto';
import responseCodeEnum from '../../common/enum/ResponseCode.enum';
import ResponseCodeEnum from '../../common/enum/ResponseCode.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/signup')
  @PublicDecorator() // Guard를 비활성화
  async signup(@Body() user: CreateUserDto): Promise<executeResponseDto> {
    return await this.authService.signup(user);
  }

  @Get('/account/duplicates')
  @PublicDecorator() // Guard를 비활성화
  async duplicates(@Query() user: UserAuthDto): Promise<executeResponseDto> {
    console.log(user.userEmail);
    return await this.authService.duplicates(user.userEmail);
  }

  @Post('/refresh')
  @PublicDecorator() // Guard를 비활성화
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const newAccessToken = (await this.authService.refresh(refreshTokenDto))
        .accessToken;
      res.setHeader('Authorization', 'Bearer ' + newAccessToken);
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
      });
      res.send({ newAccessToken });
    } catch (err) {
      return new executeResponseDto(ResponseCodeEnum.unauthorized, 0);
    }
  }

  @Post('/login')
  @PublicDecorator() // Guard를 비활성화
  async login(
    @Body() user: UserAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const validateUser = await this.authService.validateUser(user);
    const accessToken =
      await this.authService.generateAccessToken(validateUser);
    const refreshToken =
      await this.authService.generateRefreshToken(validateUser);

    await this.userService.setCurrentRefreshToken(
      refreshToken,
      validateUser.userSno,
    );

    res.setHeader('Authorization', 'Bearer ' + [accessToken, refreshToken]);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });
    return {
      message: 'login success',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  @Get('/account/:sno')
  @UseGuards(JwtAccessGuard)
  async account(@Body() sno: number): Promise<UserResponseDto> {
    return await this.userService.find(sno);
  }

  @Get('/authenticate')
  @UseGuards(JwtAccessGuard)
  async user(@Req() req: any, @Res() res: Response): Promise<any> {
    const userSno: number = req.user.userSno;
    const verifiedUser: UserAuthDto = await this.userService.findBySno(userSno);
    return res.send(verifiedUser);
  }

  @Post('/logout')
  @UseGuards(JwtRefreshGuard)
  async logout(@Req() req: any, @Res() res: Response): Promise<any> {
    await this.userService.removeRefreshToken(req.user.userSno);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.send({ responseCode: responseCodeEnum.success });
  }

  @Delete('/account')
  @UseGuards(JwtAccessGuard)
  async resign(
    @Body() user: UserAuthDto,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<executeResponseDto> {
    await this.userService.removeRefreshToken(user.userSno);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    const result = await this.authService.resign(user);
    res.send(result);
    return result;
  }
}
