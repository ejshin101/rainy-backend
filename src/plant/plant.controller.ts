import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlantService } from './plant.service';
import { Plant } from './plant.entity';
import { CreatePlantDto } from './create-plant.dto';

@Controller('plant')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}
  @Get()
  findAll(): Promise<Plant[]> {
    return this.plantService.findAll();
  }

  @Post()
  createPlant(@Body() plantData: CreatePlantDto): Promise<Plant> {
    return this.plantService.create(plantData);
  }

  @Get('/list')
  getPlantList() {

  }
}
