import { Controller, Get, Query } from '@nestjs/common';
import { PlantListService } from './plantList.service';

@Controller('plantlist')
export class PlantListController {
  constructor(private readonly plantListService: PlantListService) {}

  @Get()
  async getGardenList(
    @Query('pageNo') pageNo: number,
    @Query('numOfRows') numOfRows: number,
  ) {
    const gardenList = await this.plantListService.getGardenList(
      pageNo,
      numOfRows,
    );
    const saveList = await this.plantListService.savePlants(gardenList);
    return saveList;
  }
}
