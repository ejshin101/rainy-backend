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
    userSno,
    userPlntResponseDto: UserPlntResponseDto,
  ): Promise<pagingResponseDto<UserPlnt>> {
    const total = await this.userPlntRepository
      .createQueryBuilder('userPlnt')
      .where(
        'userPlnt.userPlntNm like :userPlntNm and userPlnt.userSno = :userSno',
        {
          userPlntNm: `%${userPlntResponseDto.userPlntNm}%`,
          userSno: userSno,
        },
      )
      .getCount();

    const resultData = await this.userPlntRepository
      .createQueryBuilder('userPlnt')
      .select('userPlnt.userPlntSno', 'userPlntSno')
      .addSelect('userPlnt.userPlntNm', 'userPlntNm')
      .addSelect('userPlnt.plntTypeSno', 'plntTypeSno')
      .addSelect('userPlnt.plntAdptDt', 'plntAdptDt')
      .addSelect('userPlnt.plntAdptPrice', 'plntAdptPrice')
      .addSelect('userPlnt.plntAdptLctnNm', 'plntAdptLctnNm')
      .addSelect('userPlnt.plntDesc', 'plntDesc')
      .addSelect('userPlnt.crteDtt', 'crteDtt')
      .addSelect('userPlnt.editDtt', 'editDtt')
      .addSelect('userPlnt.userSno', 'userSno')
      .addSelect(
        'ROW_NUMBER () OVER (ORDER BY userPlnt.userPlntSno ASC)',
        'rowNum',
      )
      .take(userPlntResponseDto.pageSize)
      .where(
        'userPlnt.userPlntNm like :userPlntNm and userPlnt.userSno = :userSno',
        {
          userPlntNm: `%${userPlntResponseDto.userPlntNm}%`,
          userSno: userSno,
        },
      )
      .skip(userPlntResponseDto.getOffset())
      .getRawMany();

    return new pagingResponseDto(
      ResponseCodeEnum.success,
      total,
      userPlntResponseDto.pageNo,
      userPlntResponseDto.pageSize,
      resultData,
    );
  }

  async find(userSno, userPlntSno): Promise<UserPlnt> {
    return await this.userPlntRepository
      .createQueryBuilder('userPlnt')
      .select()
      .where(
        'userPlnt.userPlntSno like :userPlntSno and userPlnt.userSno = :userSno',
        {
          userPlntSno: userPlntSno,
          userSno: userSno,
        },
      )
      .getOne();
  }

  async create(
    userSno,
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
        userSno: userSno,
      })
      .execute();
    return new executeResponseDto(ResponseCodeEnum.success, 1);
  }
  async update(
    userSno,
    userPlntSno,
    UpdateUserPlntDto: UpdateUserPlntDto,
  ): Promise<executeResponseDto> {
    const updateData = {
      ...UpdateUserPlntDto,
      editDtt: new Date(),
    };

    const result = await this.userPlntRepository
      .createQueryBuilder()
      .update(UserPlnt)
      .set(updateData)
      .where('user_plnt_sno = :userPlntSno and user_sno = :userSno', {
        userPlntSno: userPlntSno,
        userSno: userSno,
      })
      .execute();

    return new executeResponseDto(ResponseCodeEnum.success, result.affected);
  }

  async delete(userSno, userPlntSno): Promise<executeResponseDto> {
    const result = await this.userPlntRepository
      .createQueryBuilder()
      .delete()
      .where({ userPlntSno: userPlntSno, userSno: userSno })
      .execute();
    if (result.affected === 0) {
      throw new NotFoundException(`${userPlntSno} is not exist`);
    }
    return new executeResponseDto(ResponseCodeEnum.success, result.affected);
  }
}
