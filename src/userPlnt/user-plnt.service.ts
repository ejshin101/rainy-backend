import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserPlnt } from './user-plnt.entity';
import { pagingResponseDto } from '../common/dto/pagingResponse.dto';
import { UserPlntResponseDto } from './dto/user-plnt-response.dto';
import { CreateUserPlntDto } from './dto/create-user-plnt.dto';
import ResponseCodeEnum from '../common/enum/ResponseCode.enum';
import { UpdateUserPlntDto } from './dto/update-user-plnt.dto';
import { executeResponseDto } from '../common/dto/executeResponse.dto';

@Injectable()
export class UserPlntService {
  constructor(
    @Inject('USER_PLNT_REPOSITORY')
    private userPlntRepository: Repository<UserPlnt>,
  ) {}

  async findAll(
    userId,
    userPlntResponseDto: UserPlntResponseDto,
  ): Promise<pagingResponseDto<UserPlnt>> {
    const total = await this.userPlntRepository
      .createQueryBuilder('userPlnt')
      .where(
        'userPlnt.userPlntNm like :userPlntNm and userPlnt.userSno = :userSno',
        {
          userPlntNm: `%${userPlntResponseDto.userPlntNm}%`,
          userSno: userId,
        },
      )
      .getCount();

    const resultData = await this.userPlntRepository
      .createQueryBuilder('userPlnt')
      .select()
      .take(userPlntResponseDto.pageSize)
      .where(
        'userPlnt.userPlntNm like :userPlntNm and userPlnt.userSno = :userSno',
        {
          userPlntNm: `%${userPlntResponseDto.userPlntNm}%`,
          userSno: userId,
        },
      )
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

  async find(userId, plantId): Promise<UserPlnt> {
    return await this.userPlntRepository
      .createQueryBuilder('userPlnt')
      .select()
      .where(
        'userPlnt.userPlntSno like :userPlntSno and userPlnt.userSno = :userSno',
        {
          userPlntSno: plantId,
          userSno: userId,
        },
      )
      .getOne();
  }

  async create(
    userId,
    createUserPlntDto: CreateUserPlntDto,
  ): Promise<executeResponseDto> {
    const {
      userPlntNm,
      plntTypeSno,
      plntAdptDt,
      plntAdptPrice,
      plntAdptLctnNm,
      plntDesc,
    } = createUserPlntDto;
    await this.userPlntRepository
      .createQueryBuilder()
      .insert()
      .into(UserPlnt)
      .values({
        userPlntNm: userPlntNm,
        plntTypeSno: plntTypeSno,
        plntAdptDt: plntAdptDt,
        plntAdptPrice: plntAdptPrice,
        plntAdptLctnNm: plntAdptLctnNm,
        plntDesc: plntDesc,
        userSno: userId,
      })
      .execute();
    return new executeResponseDto(ResponseCodeEnum.success, 1);
  }
  async update(
    userId,
    plantId,
    updateEntity: UpdateUserPlntDto,
  ): Promise<executeResponseDto> {
    const updateData = {
      ...updateEntity,
      editDtt: new Date(),
    };

    const result = await this.userPlntRepository
      .createQueryBuilder()
      .update(UserPlnt)
      .set(updateData)
      .where('user_plnt_sno = :plantId and user_sno = :userId', {
        plantId: plantId,
        userId: userId,
      })
      .execute();

    return new executeResponseDto(ResponseCodeEnum.success, result.affected);
  }

  async delete(userId, plantId): Promise<executeResponseDto> {
    const result = await this.userPlntRepository
      .createQueryBuilder()
      .delete()
      .where({ userPlntSno: plantId, userSno: userId })
      .execute();
    if (result.affected === 0) {
      throw new NotFoundException(`${plantId} is not exist`);
    }
    return new executeResponseDto(ResponseCodeEnum.success, result.affected);
  }
}
