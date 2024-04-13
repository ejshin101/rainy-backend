import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Plant } from './plant.entity';
import { CreatePlantDto } from './create-plant.dto';

@Injectable()
export class PlantService {
  constructor(
    @Inject('PLANT_REPOSITORY')
    private plantRepository: Repository<Plant>,
  ) {}
  async findAll(): Promise<Plant[]> {
    return await this.plantRepository.find({});
  }

  async find(id): Promise<Plant> {
    return await this.plantRepository.findOneBy({ PLNT_TYPE_SNO: id });
  }

  async create(createPlantDto: CreatePlantDto): Promise<Plant> {
    const { PLNT_TYPE_KOR } = createPlantDto;
    const plant = await this.plantRepository.create({
      PLNT_TYPE_KOR,
    });

    await this.plantRepository.save(plant);
    return plant;
  }

  async update(id, updateEntity: CreatePlantDto): Promise<Plant> {
    const plant = await this.plantRepository.findOneBy({ PLNT_TYPE_SNO: id });
    const newEntity = {
      ...plant,
      ...updateEntity,
    };
    return await this.plantRepository.save(newEntity);
  }

  async delete(id): Promise<void> {
    const result = await this.plantRepository.delete({ PLNT_TYPE_SNO: id });
    if (result.affected === 0) {
      throw new NotFoundException(`${id} is not exist`);
    }
  }
}
