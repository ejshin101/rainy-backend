import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Plant } from './plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { pagingResponseDto } from '../common/dto/pagingResponse.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';

@Injectable()
export class PlantService {
  constructor(
    @Inject('PLANT_REPOSITORY')
    private plantRepository: Repository<Plant>,
  ) {}

  async findAll(
    createPlantDto: CreatePlantDto,
  ): Promise<pagingResponseDto<Plant>> {
    const total = await this.plantRepository
      .createQueryBuilder('plant')
      .where('plant.plntTypeKor like :plntTypeKor', {
        plntTypeKor: `%${createPlantDto.plntTypeKor}%`,
      })
      .getCount();

    const resultData = await this.plantRepository
      .createQueryBuilder('plant')
      .select()
      .take(createPlantDto.pageSize)
      .where('plant.plntTypeKor like :plntTypeKor', {
        plntTypeKor: `%${createPlantDto.plntTypeKor}%`,
      })
      .skip(createPlantDto.getOffset())
      .getMany();
    return new pagingResponseDto(
      '000',
      total,
      createPlantDto.pageNo,
      createPlantDto.pageSize,
      resultData,
    );
  }

  async find(id): Promise<Plant> {
    return await this.plantRepository.findOneBy({ plntTypeSno: id });
  }

  async create(createPlantDto: CreatePlantDto): Promise<Plant> {
    let { plntTypeSno } = createPlantDto;
    const { plntTypeKor } = createPlantDto;
    plntTypeSno = (await this.plantRepository.count()) + 1;
    const plant = await this.plantRepository.create({
      plntTypeSno,
      plntTypeKor,
    });

    await this.plantRepository.save(plant);
    return plant;
  }

  async update(id, updateEntity: UpdatePlantDto): Promise<Plant> {
    const plant = await this.plantRepository.findOneBy({ plntTypeSno: id });
    const newEntity = {
      ...plant,
      ...updateEntity,
    };
    return await this.plantRepository.save(newEntity);
  }

  async delete(id): Promise<void> {
    const result = await this.plantRepository.delete({ plntTypeSno: id });
    if (result.affected === 0) {
      throw new NotFoundException(`${id} is not exist`);
    }
  }
}
