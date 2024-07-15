import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  Res,
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
import { UpdateUserDto } from '../dto/UpdateUserDto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/signup')
  @PublicDecorator() // Guard를 비활성화
  async signup(@Body() user: UpdateUserDto): Promise<executeResponseDto> {
    const getUserEmail = user.userEmail;
    const getUser = await this.userService.findByEmail(getUserEmail);

    if (!getUser) {
      return new executeResponseDto(ResponseCodeEnum.noExistingData, 0);
    }

    return await this.authService.signup(user);
  }

  @Get('/account/duplicates')
  @PublicDecorator() // Guard를 비활성화
  async duplicates(@Query() user: UserAuthDto): Promise<executeResponseDto> {
    return await this.authService.duplicates(user.userEmail);
  }

  @Post('/refresh')
  @PublicDecorator() // Guard를 비활성화
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const newAccessToken = (await this.authService.refresh(refreshTokenDto))
      .accessToken;

    if (newAccessToken === '' || newAccessToken === null) {
      res.send({
        responseCode: ResponseCodeEnum.unauthorized,
        newAccessToken: '',
      });
    } else {
      res.setHeader('Authorization', 'Bearer ' + newAccessToken);
      res.send({ ResponseCode: ResponseCodeEnum.success, newAccessToken });
    }
  }

  @Post('/login')
  @PublicDecorator() // Guard를 비활성화
  async login(
    @Body() user: UserAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const validateUser = await this.authService.validateUser(user);

    if (validateUser === ResponseCodeEnum.badRequest) {
      return {
        responseCode: validateUser,
        accessToken: '',
        refreshToken: '',
      };
    } else if (validateUser) {
      const userAuthDto = validateUser as UserAuthDto;

      const accessToken =
        await this.authService.generateAccessToken(userAuthDto);
      const refreshToken =
        await this.authService.generateRefreshToken(userAuthDto);

      await this.userService.setCurrentRefreshToken(
        refreshToken,
        userAuthDto.userSno,
      );

      res.setHeader('Authorization', 'Bearer ' + [accessToken, refreshToken]);
      return {
        responseCode: '000',
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    }
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
    return res.send({ responseCode: responseCodeEnum.success });
  }

  @Delete('/account')
  @UseGuards(JwtAccessGuard)
  async resign(
    @Body() user: UserAuthDto,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<executeResponseDto | ResponseCodeEnum> {
    await this.userService.removeRefreshToken(user.userSno);
    const result = await this.authService.resign(user);
    res.send(result);
    return result;
  }
}
