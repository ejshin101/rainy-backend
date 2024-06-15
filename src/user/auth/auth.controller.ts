import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/CreateUserDto';
import { executeResponseDto } from '../../common/dto/executeResponse.dto';
import { UserAuthDto } from '../dto/UserAuthDto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() user: CreateUserDto): Promise<executeResponseDto> {
    return await this.authService.signup(user);
  }

  @Post('/login')
  async login(@Body() user: UserAuthDto, @Res() res: Response): Promise<any> {
    const jwt = await this.authService.login(user);
    res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
    return res.json(jwt);
  }

  //JWT 토큰을 실어보낸 로그인 시, 인증 확인용 라우터
  @Get('/authenticate')
  @UseGuards(AuthGuard)
  isAuthenticated(@Req() req: Request): any {
    const user: any = req.user;
    return user;
  }
}
