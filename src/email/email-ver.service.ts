import { Inject, Injectable } from '@nestjs/common';
import { SendEmailVerDto } from './dto/send-email-ver.dto';
import { executeResponseDto } from '../common/dto/executeResponse.dto';
import { Repository } from 'typeorm';
import { EmailVer } from './email-ver.entity';
import ResponseCodeEnum from '../common/enum/ResponseCode.enum';
import { EmailVerResponseDto } from './dto/email-ver-response.dto';
import { UpdateEmailVerDto } from './dto/update-email-ver.dto';

@Injectable()
export class EmailVerService {
  constructor(
    @Inject('EMAIL_VER_REPOSITORY')
    private emailVerRepository: Repository<EmailVer>,
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

  async update(
    sno: number,
    email: UpdateEmailVerDto,
  ): Promise<executeResponseDto> {
    const now = new Date();
    const exprDtt = new Date(now.getTime() + 5 * 60 * 1000);

    const updateData = {
      ...(email.emailVerCd && { EMAIL_VER_CD: email.emailVerCd }),
      EXPR_DTT: exprDtt,
    };

    const result = await this.emailVerRepository
      .createQueryBuilder()
      .update(EmailVer)
      .set(updateData)
      .where('USER_SNO = :sno', { sno })
      .execute();

    return new executeResponseDto(ResponseCodeEnum.success, result.affected);
  }
}
