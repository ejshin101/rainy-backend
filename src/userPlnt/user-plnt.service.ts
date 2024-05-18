import { Inject, Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserPlnt } from './user-plnt.entity';
import { pagingResponseDto } from '../common/dto/pagingResponse.dto';
import { UserPlntResponseDto } from './dto/user-plnt-response.dto';
import { CreateUserPlntDto } from './dto/create-user-plnt.dto';
import ResponseCodeEnum from '../common/enum/ResponseCode.enum';

@Injectable()
export class UserPlntService {
  constructor(
    @Inject('USER_PLNT_REPOSITORY')
    private userPlntRepository: Repository<UserPlnt>,
  ) {}

  async findAll(
    userPlntResponseDto: UserPlntResponseDto,
  ): Promise<pagingResponseDto<UserPlnt>> {
    const total = await this.userPlntRepository
      .createQueryBuilder('userPlnt')
      .where('userPlnt.userPlntNm like :userPlntNm', {
        userPlntNm: `%${userPlntResponseDto.userPlntNm}%`,
      })
      .getCount();

    const resultData = await this.userPlntRepository
      .createQueryBuilder('userPlnt')
      .select()
      .take(userPlntResponseDto.pageSize)
      .where('userPlnt.userPlntNm like :userPlntNm', {
        userPlntNm: `%${userPlntResponseDto.userPlntNm}%`,
      })
      .skip(userPlntResponseDto.getOffset())
      .getMany();

    return new pagingResponseDto(
      ResponseCodeEnum.success,
      total,
      userPlntResponseDto.pageNo,
      userPlntResponseDto.pageSize,
      resultData,
    );
  }

  async find(id): Promise<SelectQueryBuilder<UserPlnt>> {
    return this.userPlntRepository
      .createQueryBuilder('userPlnt')
      .select()
      .where('userPlnt.userPlntSno =:userPlntSno', {
        userPlntSno: id,
      });
  }

  // async create(createUserPlntDto: CreateUserPlntDto): Promise<UserPlnt> {
  //   const {userPlntNm, plntTypeSno, plntAdptDt, plntAdptPrice, plntAdptLctnNm, plntDesc, userSno} = createUserPlntDto;
  //   const userPlnt = await this.userPlntRepository.createQueryBuilder('userPlnt')
  //     .insert().into()
  // }
  // async update(): Promise<UserPlnt> {}
  // async delete(): Promise<void> {}
}
