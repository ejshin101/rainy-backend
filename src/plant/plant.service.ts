import { Inject, Injectable } from '@nestjs/common';
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

  async create(createPlantDto: CreatePlantDto): Promise<Plant> {
    const { PLNT_TYPE_KOR, PLNT_TYPE_ENG } = createPlantDto;
    const plant = await this.plantRepository.create({
      PLNT_TYPE_KOR,
      PLNT_TYPE_ENG,
    });

    await this.plantRepository.save(plant);
    return plant;
  }
}
