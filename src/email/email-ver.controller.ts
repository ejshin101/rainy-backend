import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { EmailVerService } from './email-ver.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/CreateUserDto';
import { PublicDecorator } from '../common/public.decorator';
import { executeResponseDto } from '../common/dto/executeResponse.dto';
import ResponseCodeEnum from '../common/enum/ResponseCode.enum';
import { CodeCheckEmailVerDto } from './dto/code-check-email-ver.dto';
import TrueFalseCodeEnum from '../common/enum/TrueFalseCode.enum';

@Controller('email')
export class EmailVerController {
  constructor(
    private emailVerService: EmailVerService,
    private userService: UserService,
  ) {}

  @Get()
  @PublicDecorator() // Guard를 비활성화
  async sendEmail(@Query() user: CreateUserDto) {
    const userTemp = await this.userService.createTemp(user);
    return this.emailVerService.sendVerCd(userTemp);
  }

  @Post('/code-check')
  @PublicDecorator()
  async codeCheck(@Body() user: CodeCheckEmailVerDto) {
    const getEmailVerCd = user.emailVerCd;
    const getUserEmail = user.userEmail;

    const getUser = await this.userService.findByEmail(getUserEmail);

    if (!getUser) {
      return new executeResponseDto(ResponseCodeEnum.noExistingData, 0);
    }

    const result = await this.emailVerService.findByCurrentTime(
      getUser.userSno,
    );
    if (!result) {
      return new executeResponseDto(ResponseCodeEnum.noVerCd, 0);
    } else if (result.emailVerCd !== getEmailVerCd) {
      return new executeResponseDto(ResponseCodeEnum.wrongVerCd, 0);
    } else if (result.emailVerCd === getEmailVerCd) {
      await this.userService.updateUserUseTf(
        getUser.userSno,
        TrueFalseCodeEnum.isTrue,
      );
      return new executeResponseDto(ResponseCodeEnum.success, 1);
    }
  }

  @Post('/code-renew')
  @PublicDecorator()
  async codeRenew(@Body() user: CodeCheckEmailVerDto) {
    const getUserEmail = user.userEmail;

    const getUser = await this.userService.findByEmail(getUserEmail);

    if (!getUser) {
      return new executeResponseDto(ResponseCodeEnum.noExistingData, 0);
    }

    const result = await this.emailVerService.update(getUser.userSno);
    return result;
  }

  // @Get('/email/forgot-password')
  // @PublicDecorator()
  // async forgotPassword() {
  //
  // }
}
