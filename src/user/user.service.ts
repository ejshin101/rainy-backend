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
import { ConfigService } from '@nestjs/config';
import process from 'process';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
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
      .andWhere('user.DEL_TF = :delTf', { delTf: 'F' })
      .select('user.USER_SNO', 'userSno')
      .addSelect('user.USER_EMAIL', 'userEmail')
      .addSelect('user.USER_PSWD', 'userPswd')
      .addSelect('user.USER_CD', 'userCd')
      .addSelect('user.USER_STAT_CD', 'userStatCd')
      .addSelect('user.DEL_TF', 'delTf')
      .getRawOne();
  }

  async findBySno(sno: number): Promise<UserAuthDto> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.USER_SNO = :sno', { sno })
      .select('user.USER_SNO', 'userSno')
      .addSelect('user.USER_NM', 'userNm')
      .addSelect('user.USER_EMAIL', 'userEmail')
      .addSelect('user.USER_PSWD', 'userPswd')
      .addSelect('user.USER_CD', 'userCd')
      .addSelect('user.USER_STAT_CD', 'userStatCd')
      .addSelect('user.REFRESH_TOKEN', 'refreshToken')
      .addSelect('user.REFRESH_TOKEN_EXP', 'refreshTokenExp')
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
        REFRESH_TOKEN: null,
        REFRESH_TOKEN_EXP: null,
        EDIT_DTT: new Date(),
      })
      .where('USER_SNO = :sno', { sno })
      .execute();

    return new executeResponseDto(ResponseCodeEnum.success, result.affected);
  }

  async transformPassword(user: CreateUserDto): Promise<void> {
    user.userPswd = await bcrypt.hash(user.userPswd, 10);
    return Promise.resolve();
  }

  async setCurrentRefreshToken(refreshToken: string, sno: number) {
    const currentRefreshToken =
      await this.getCurrentHashedRefreshToken(refreshToken);
    const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();

    const updateRefresh = {
      REFRESH_TOKEN: currentRefreshToken,
      REFRESH_TOKEN_EXP: currentRefreshTokenExp,
    };

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateRefresh)
      .where('USER_SNO = :sno', { sno })
      .execute();
  }

  async getCurrentHashedRefreshToken(refreshToken: string) {
    const currentRefreshToken = await bcrypt.hash(refreshToken, 10);
    return currentRefreshToken;
  }

  async getCurrentRefreshTokenExp(): Promise<Date> {
    const currentDate = new Date();
    console.log(currentDate.toLocaleString());
    const refreshTokenExpireInSeconds =
      Number(process.env.JWT_REFRESH_EXPIRE) || 86400; // 기본값 1일

    // 현재 시간에 refreshTokenExpireInSeconds를 더하여 새로운 날짜 계산
    const currentRefreshTokenExp = new Date(
      currentDate.getTime() + refreshTokenExpireInSeconds * 1000,
    );
    console.log(currentRefreshTokenExp.toLocaleString());
    return currentRefreshTokenExp;
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    sno: number,
  ): Promise<UserAuthDto> {
    const user: UserAuthDto = await this.findBySno(sno);

    // user에 currentRefreshToken이 없다면 null을 반환 (즉, 토큰 값이 null일 경우)
    if (!user.refreshToken) {
      return null;
    }

    // 유저 테이블 내에 정의된 암호화된 refresh_token값과 요청 시 body에 담아준 refresh_token값 비교
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    // 만약 isRefreshTokenMatching이 true라면 user 객체를 반환
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(sno: number): Promise<any> {
    const updateRefresh = {
      REFRESH_TOKEN: null,
      REFRESH_TOKEN_EXP: null,
    };

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateRefresh)
      .where('USER_SNO = :sno', { sno })
      .execute();
  }
}
