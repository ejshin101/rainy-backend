import { Inject, Injectable } from '@nestjs/common';
import { SendEmailVerDto } from './dto/send-email-ver.dto';
import { executeResponseDto } from '../common/dto/executeResponse.dto';
import { Repository } from 'typeorm';
import { EmailVer } from './email-ver.entity';
import ResponseCodeEnum from '../common/enum/ResponseCode.enum';
import { EmailVerResponseDto } from './dto/email-ver-response.dto';
import { MailerService } from '@nestjs-modules/mailer';
import responseCodeEnum from '../common/enum/ResponseCode.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class EmailVerService {
  constructor(
    @Inject('EMAIL_VER_REPOSITORY')
    private readonly emailVerRepository: Repository<EmailVer>,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async create(email: SendEmailVerDto): Promise<executeResponseDto> {
    const now = new Date();
    const exprDtt = new Date(now.getTime() + 5 * 60 * 1000);

    const result = await this.emailVerRepository
      .createQueryBuilder()
      .insert()
      .into(EmailVer)
      .values({
        USER_SNO: email.userSno,
        EMAIL_VER_CD: email.emailVerCd,
        CRTE_DTT: now,
        EXPR_DTT: exprDtt,
      })
      .execute();

    return new executeResponseDto(ResponseCodeEnum.success, 1);
  }

  async findByUserSno(sno: number): Promise<EmailVerResponseDto> {
    return await this.emailVerRepository
      .createQueryBuilder('emailVer')
      .where('emailVer.USER_SNO = :sno', { sno })
      .select('emailVer.EMAIL_VER_SNO', 'emailVerSno')
      .addSelect('emailVer.USER_SNO', 'userSno')
      .addSelect('emailVer.EMAIL_VER_CD', 'emailVerCd')
      .addSelect('emailVer.CRTE_DTT', 'crteDtt')
      .addSelect('emailVer.EXPR_DTT', 'exprDtt')
      .getRawOne();
  }

  async findByCurrentTime(sno: number): Promise<EmailVerResponseDto> {
    const currentTime = new Date();
    return await this.emailVerRepository
      .createQueryBuilder('emailVer')
      .where('emailVer.USER_SNO = :sno', { sno })
      .andWhere('emailVer.CRTE_DTT <= :currentTime', { currentTime })
      .andWhere('emailVer.EXPR_DTT >= :currentTime', { currentTime })
      .select('emailVer.EMAIL_VER_SNO', 'emailVerSno')
      .addSelect('emailVer.USER_SNO', 'userSno')
      .addSelect('emailVer.EMAIL_VER_CD', 'emailVerCd')
      .addSelect('emailVer.CRTE_DTT', 'crteDtt')
      .addSelect('emailVer.EXPR_DTT', 'exprDtt')
      .getRawOne();
  }

  async update(email: SendEmailVerDto): Promise<executeResponseDto> {
    const now = new Date();
    const exprDtt = new Date(now.getTime() + 5 * 60 * 1000);

    const updateData = {
      EMAIL_VER_CD: email.emailVerCd,
      EXPR_DTT: exprDtt,
    };

    const result = await this.emailVerRepository
      .createQueryBuilder()
      .update(EmailVer)
      .set(updateData)
      .where('USER_SNO = :sno', { sno: email.userSno })
      .execute();

    return new executeResponseDto(ResponseCodeEnum.success, result.affected);
  }

  async sendVerCd(sno: number) {
    const userFind = await this.userService.find(sno);

    if (!userFind) {
      return new executeResponseDto(responseCodeEnum.noExistingData, 0);
    }

    const emailVerCd = Math.floor(100000 + Math.random() * 900000).toString();

    await this.mailerService.sendMail({
      to: userFind.userEmail,
      subject: 'rainy green 인증번호',
      template: 'auth-email',
      context: {
        emailVerCd: emailVerCd,
      },
    });

    const emailVerDto = new SendEmailVerDto(userFind.userSno, emailVerCd);

    const emailFind = await this.findByUserSno(userFind.userSno);

    if (!emailFind) {
      await this.create(emailVerDto);
    } else {
      await this.update(emailVerDto);
    }

    return new executeResponseDto(ResponseCodeEnum.success, 1);
  }
}
