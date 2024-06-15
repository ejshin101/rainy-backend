import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { GetAllUsersRequestDto } from './dto/GetAllUsersRequestDto';
import { pagingResponseDto } from '../common/dto/pagingResponse.dto';
import ResponseCodeEnum from '../common/enum/ResponseCode.enum';
import { UserResponseDto } from './dto/UserResponseDto';
import { CreateUserDto } from './dto/CreateUserDto';
import { executeResponseDto } from '../common/dto/executeResponse.dto';
import TrueFalseCodeEnum from '../common/enum/TrueFalseCode.enum';
import UserStatusCodeEnum from '../common/enum/user/UserStatusCode.enum';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { UserAuthDto } from './dto/UserAuthDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAll(
    getAllUsersRequestDto: GetAllUsersRequestDto,
  ): Promise<pagingResponseDto<UserResponseDto>> {
    const count: any = await this.userRepository
      .createQueryBuilder('user')
      .where('user.USER_NM LIKE :keyword', {
        keyword: `%${getAllUsersRequestDto.keyword}%`,
      })
      .andWhere('user.DEL_TF = "F"')
      .select('COUNT(*)', 'total')
      .getRawOne();

    const resultData: UserResponseDto[] = await this.userRepository
      .createQueryBuilder('user')
      .where('user.USER_NM LIKE :keyword', {
        keyword: `%${getAllUsersRequestDto.keyword}%`,
      })
      .andWhere('user.DEL_TF = "F"')
      .select('user.USER_SNO', 'userSno')
      .addSelect('user.USER_EMAIL', 'userEmail')
      .addSelect('user.USER_CD', 'userCd')
      .addSelect('user.USER_STAT_CD', 'userStatCd')
      .addSelect('user.DEL_TF', 'delTf')
      .take(getAllUsersRequestDto.pageSize)
      .skip(getAllUsersRequestDto.getOffset())
      .getRawMany();

    return new pagingResponseDto(
      ResponseCodeEnum.success,
      count.total,
      getAllUsersRequestDto.pageNo,
      getAllUsersRequestDto.pageSize,
      resultData,
    );
  }

  async find(sno: number): Promise<UserResponseDto> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.USER_SNO = :sno', { sno })
      .select('user.USER_SNO', 'userSno')
      .addSelect('user.USER_EMAIL', 'userEmail')
      .addSelect('user.USER_CD', 'userCd')
      .addSelect('user.USER_STAT_CD', 'userStatCd')
      .addSelect('user.DEL_TF', 'delTf')
      .getRawOne();
  }

  async findByEmail(userEmail: string): Promise<UserAuthDto> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.USER_EMAIL = :userEmail', { userEmail })
      .select('user.USER_SNO', 'userSno')
      .addSelect('user.USER_EMAIL', 'userEmail')
      .addSelect('user.USER_PSWD', 'userPswd')
      .addSelect('user.USER_CD', 'userCd')
      .addSelect('user.USER_STAT_CD', 'userStatCd')
      .addSelect('user.DEL_TF', 'delTf')
      .getRawOne();
  }

  async create(user: CreateUserDto): Promise<executeResponseDto> {
    await this.transformPassword(user);
    const result = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        USER_NM: user.userNm,
        USER_EMAIL: user.userEmail,
        USER_PSWD: user.userPswd,
        USER_USE_TF: TrueFalseCodeEnum.isTrue,
        USER_CD: user.userCd,
        USER_STAT_CD: UserStatusCodeEnum.active,
        CRTE_DTT: new Date(),
        DEL_TF: TrueFalseCodeEnum.isFalse,
      })
      .execute();

    return new executeResponseDto(ResponseCodeEnum.success, 1);
  }

  async update(sno: number, user: UpdateUserDto): Promise<executeResponseDto> {
    const updateData = {
      ...(user.userNm && { USER_NM: user.userNm }),
      ...(user.userEmail && { USER_EMAIL: user.userEmail }),
      ...(user.userPswd && { USER_PSWD: user.userPswd }),
      ...(user.userUseTf && { USER_USE_TF: user.userUseTf }),
      ...(user.userCd && { USER_CD: user.userCd }),
      ...(user.userStatCd && { USER_STAT_CD: user.userStatCd }),
      EDIT_DTT: new Date(),
    };

    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateData)
      .where('USER_SNO = :sno', { sno })
      .execute();

    return new executeResponseDto(ResponseCodeEnum.success, result.affected);
  }

  async delete(sno: number): Promise<executeResponseDto> {
    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        DEL_TF: TrueFalseCodeEnum.isTrue,
      })
      .where('USER_SNO = :sno', { sno })
      .execute();

    return new executeResponseDto(ResponseCodeEnum.success, result.affected);
  }

  async transformPassword(user: CreateUserDto): Promise<void> {
    user.userPswd = await bcrypt.hash(user.userPswd, 10);
    return Promise.resolve();
  }
}
