import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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

  @Get('/:id')
  findById(@Param('id') id: number): Promise<Plant> {
    return this.plantService.find(id);
  }

  @Post()
  createPlant(@Body() plantData: CreatePlantDto): Promise<Plant> {
    return this.plantService.create(plantData);
  }

  @Put('/:id')
  updatePlant(
    @Param('id') id: number,
    @Body() plantData: CreatePlantDto,
  ): Promise<Plant> {
    return this.plantService.update(id, plantData);
  }

  @Delete('/:id')
  delete(@Param('id') id: number): Promise<void> {
    return this.plantService.delete(id);
  }
}
