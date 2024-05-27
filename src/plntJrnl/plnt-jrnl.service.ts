import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PlntJrnl } from './plnt-jrnl.entity';
import { PlntJrnlResponseDto } from './dto/plnt-jrnl-response.dto';
import { pagingResponseDto } from '../common/dto/pagingResponse.dto';
import ResponseCodeEnum from '../common/enum/ResponseCode.enum';
import { CreatePlntJrnlDto } from './dto/create-plnt-jrnl.dto';
import { executeResponseDto } from '../common/dto/executeResponse.dto';
import { UpdatePlntJrnlDto } from './dto/update-plnt-jrnl.dto';

@Injectable()
export class PlntJrnlService {
  constructor(
    @Inject('PLNT_JRNL_REPOSITORY')
    private plntJrnlRepository: Repository<PlntJrnl>,
  ) {}

  async findAll(
    userSno,
    plntJrnlResponseDto: PlntJrnlResponseDto,
  ): Promise<pagingResponseDto<PlntJrnl>> {
    const total = await this.plntJrnlRepository
      .createQueryBuilder('plntJrnl')
      .where(
        'plntJrnl.userSno = :userSno and plntJrnl.plntJrnlTtle like :plntJrnlTtle and plntJrnl.plntJrnlCtnt like :plntJrnlCtnt',
        {
          userSno: userSno,
          plntJrnlTtle: `%${plntJrnlResponseDto.plntJrnlTtle}%`,
          plntJrnlCtnt: `%${plntJrnlResponseDto.plntJrnlCtnt}%`,
        },
      )
      .getCount();

    const resultData = await this.plntJrnlRepository
      .createQueryBuilder('plntJrnl')
      .select('plntJrnl.plntJrnlSno', 'plntJrnlSno')
      .select('plntJrnl.userPlntSno', 'userPlntSno')
      .addSelect('plntJrnl.userSno', 'userSno')
      .addSelect('plntJrnl.plntJrnlDt', 'plntJrnlDt')
      .addSelect('plntJrnl.plntJrnlTtle', 'plntJrnlTtle')
      .addSelect('plntJrnl.plntJrnlCtnt', 'plntJrnlCtnt')
      .addSelect('plntJrnl.crteDtt', 'crteDtt')
      .addSelect('plntJrnl.editDtt', 'editDtt')
      .addSelect(
        'ROW_NUMBER () OVER (ORDER BY plntJrnl.plntJrnlSno ASC)',
        'rowNum',
      )
      .take(plntJrnlResponseDto.pageSize)
      .where(
        'plntJrnl.userSno = :userSno and plntJrnl.plntJrnlTtle like :plntJrnlTtle and plntJrnl.plntJrnlCtnt like :plntJrnlCtnt',
        {
          userSno: userSno,
          plntJrnlTtle: `%${plntJrnlResponseDto.plntJrnlTtle}%`,
          plntJrnlCtnt: `%${plntJrnlResponseDto.plntJrnlCtnt}%`,
        },
      )
      .skip(plntJrnlResponseDto.getOffset())
      .getRawMany();

    return new pagingResponseDto(
      ResponseCodeEnum.success,
      total,
      plntJrnlResponseDto.pageNo,
      plntJrnlResponseDto.pageSize,
      resultData,
    );
  }
  async find(userSno, plntJrnlSno): Promise<PlntJrnl> {
    return await this.plntJrnlRepository
      .createQueryBuilder('plntJrnl')
      .select()
      .where(
        'plntJrnl.userSno = :userSno and plntJrnl.plntJrnlSno = :plntJrnlSno',
        {
          userSno: userSno,
          plntJrnlSno: plntJrnlSno,
        },
      )
      .getOne();
  }
  async create(
    userSno,
    createPlntJrnlDto: CreatePlntJrnlDto,
  ): Promise<executeResponseDto> {
    const { userPlntSno, plntJrnlDt, plntJrnlTtle, plntJrnlCtnt } =
      createPlntJrnlDto;

    await this.plntJrnlRepository
      .createQueryBuilder()
      .insert()
      .into(PlntJrnl)
      .values({
        userPlntSno: userPlntSno,
        userSno: userSno,
        plntJrnlDt: plntJrnlDt,
        plntJrnlTtle: plntJrnlTtle,
        plntJrnlCtnt: plntJrnlCtnt,
      })
      .execute();
    return new executeResponseDto(ResponseCodeEnum.success, 1);
  }
  async update(
    userSno,
    plntJrnlSno,
    updatePlntJrnlDto: UpdatePlntJrnlDto,
  ): Promise<executeResponseDto> {
    const updateData = {
      ...updatePlntJrnlDto,
      editDtt: new Date(),
    };

    const result = await this.plntJrnlRepository
      .createQueryBuilder()
      .update(PlntJrnl)
      .set(updateData)
      .where('user_sno = :userSno and plnt_jrnl_sno = :plntJrnlSno', {
        userSno: userSno,
        plntJrnlSno: plntJrnlSno,
      })
      .execute();

    return new executeResponseDto(ResponseCodeEnum.success, result.affected);
  }
  async delete(userSno, plntJrnlSno): Promise<executeResponseDto> {
    const result = await this.plntJrnlRepository
      .createQueryBuilder()
      .delete()
      .where({ userSno: userSno, plntJrnlSno: plntJrnlSno })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`${plntJrnlSno} is not exist`);
    }
    return new executeResponseDto(ResponseCodeEnum.success, result.affected);
  }
}
