import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  DeleteResult,
  InsertQueryBuilder,
  InsertResult,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { UserPlnt } from './user-plnt.entity';
import { pagingResponseDto } from '../common/dto/pagingResponse.dto';
import { UserPlntResponseDto } from './dto/user-plnt-response.dto';
import { CreateUserPlntDto } from './dto/create-user-plnt.dto';
import ResponseCodeEnum from '../common/enum/ResponseCode.enum';
import { UpdateUserPlntDto } from './dto/update-user-plnt.dto';
import { plainToClass } from 'class-transformer';
import { Plant } from '../plant/plant.entity';

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

  async create(createUserPlntDto: CreateUserPlntDto): Promise<UserPlnt> {
    const {
      userPlntNm,
      plntTypeSno,
      plntAdptDt,
      plntAdptPrice,
      plntAdptLctnNm,
      plntDesc,
      userSno,
    } = createUserPlntDto;
    // const result = await this.userPlntRepository
    //   .createQueryBuilder('userPlnt')
    //   .insert()
    //   .into('USER_PLNT')
    //   .values({
    //     'userPlnt.user_plnt_nm': userPlntNm,
    //     'userPlnt.plnt_type_sno': plntTypeSno,
    //     'userPlnt.plnt_adpt_dt': plntAdptDt,
    //     'userPlnt.plnt_adpt_price': plntAdptPrice,
    //     'userPlnt.plnt_adpt_lctn_nm': plntAdptLctnNm,
    //     'userPlnt.plnt_desc': plntDesc,
    //     'userPlnt.user_sno': userSno,
    //   })
    //   .execute();
    const result = await this.userPlntRepository.create({
      userPlntNm,
      plntTypeSno,
      plntAdptDt,
      plntAdptPrice,
      plntAdptLctnNm,
      plntDesc,
      userSno,
    });

    await this.userPlntRepository.save(result);
    return result;
  }
  async update(id, updateEntity: UpdateUserPlntDto): Promise<UserPlnt> {
    // const userPlnt = this.find(id);
    // let updateResult;
    // if (userPlnt !== null) {
    //   updateResult = this.userPlntRepository
    //     .createQueryBuilder('userPlnt')
    //     .update('userPlnt')
    //     .set({
    //       'userPlnt.userPlntNm': updateEntity.userPlntNm,
    //       'userPlnt.plntTypeSno': updateEntity.plntTypeSno,
    //       'userPlnt.plntAdptDt': updateEntity.plntAdptDt,
    //       'userPlnt.plntAdptPrice': updateEntity.plntAdptPrice,
    //       'userPlnt.plntAdptLctnNm': updateEntity.plntAdptLctnNm,
    //       'userPlnt.plntDesc': updateEntity.plntDesc,
    //     });
    // }
    const userPlnt = await this.userPlntRepository.findOneBy({
      userPlntSno: id,
    });
    const newEntity = {
      ...userPlnt,
      ...updateEntity,
    };
    return await this.userPlntRepository.save(newEntity);
  }

  // async delete(id): Promise<void> {
  //   const result = await this.userPlntRepository.delete({ userPlntSno: id });
  //   if (result.affected === 0) {
  //     throw new NotFoundException(`${id} is not exist`);
  //   }
  // }

  async delete(id): Promise<void> {
    const result = await this.userPlntRepository.delete({ userPlntSno: id });
    if (result.affected === 0) {
      throw new NotFoundException(`${id} is not exist`);
    }
  }
}
