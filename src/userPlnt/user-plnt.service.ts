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

  async find(id): Promise<UserPlnt> {
    return await this.userPlntRepository.findOneBy({ userPlntSno: id });
  }

  async create(
    createUserPlntDto: CreateUserPlntDto,
  ): Promise<executeResponseDto> {
    const {
      userPlntNm,
      plntTypeSno,
      plntAdptDt,
      plntAdptPrice,
      plntAdptLctnNm,
      plntDesc,
      userSno,
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
        userSno: userSno,
      })
      .execute();
    return new executeResponseDto(ResponseCodeEnum.success, 1);
  }
  async update(
    id,
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
      .where('user_plnt_sno = :id', { id })
      .execute();

    return new executeResponseDto(ResponseCodeEnum.success, result.affected);
  }

  async delete(id): Promise<executeResponseDto> {
    const result = await this.userPlntRepository
      .createQueryBuilder()
      .delete()
      .where({ userPlntSno: id })
      .execute();
    if (result.affected === 0) {
      throw new NotFoundException(`${id} is not exist`);
    }
    return new executeResponseDto(ResponseCodeEnum.success, result.affected);
  }
}
