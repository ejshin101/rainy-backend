import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PlantService } from './plant.service';
import { Plant } from './plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { pagingResponseDto } from '../common/dto/pagingResponse.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';

@Controller('plants')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}
  @Get()
  findAll(
    @Query() createPlantDto: CreatePlantDto,
  ): Promise<pagingResponseDto<Plant>> {
    return this.plantService.findAll(createPlantDto);
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
    @Body() plantData: UpdatePlantDto,
  ): Promise<Plant> {
    return this.plantService.update(id, plantData);
  }

  @Delete('/:id')
  delete(@Param('id') id: number): Promise<void> {
    return this.plantService.delete(id);
  }
}
