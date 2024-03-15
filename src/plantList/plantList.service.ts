import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as convert from 'xml-js';
import { Repository } from 'typeorm';
import { Plant } from '../plant/plant.entity';
import { CreatePlantDto } from '../plant/create-plant.dto';
import axios from 'axios';
import * as process from 'process';


@Injectable()
export class PlantListService {
  constructor(
    @Inject('PLANT_REPOSITORY')
    private plantRepository: Repository<Plant>,
  ) {}

  async getGardenList(
    pageNo: number = 1,
    numOfRows: number = 100,
  ): Promise<any> {
    const SERVICE_KEY = process.env.SERVICE_KEY;
    const HOST = 'http://api.nongsaro.go.kr/service/garden/gardenList';
    const requestUrl = `${HOST}?apiKey=${SERVICE_KEY}&pageNo=${pageNo}&numOfRows=${numOfRows}`;

    try {
      const response = await axios.get(requestUrl);
      if (response.status === 200) {
        const result = convert.xml2json(response.data, {
          compact: true,
          spaces: 4,
        });
        return JSON.parse(result);
      } else {
        throw new HttpException(
          'Failed to fetch plant data',
          HttpStatus.BAD_GATEWAY,
        );
      }
    } catch (error) {
      console.error(`err => ${error}`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async savePlants(gardenList: any): Promise<Plant[]> {
    const plants = [];
    for (let idx = 0; idx < gardenList.response.body.items.item.length; idx++) {
      const plantName =
        gardenList.response.body.items.item[idx].cntntsSj['_cdata'];
      const plantDto = new CreatePlantDto(plantName, plantName);
      const plant = await this.plantRepository.create(plantDto);
      plants.push(plant);
    }
    // 모든 식물 저장 후, 저장된 식물 배열 반환
    return this.plantRepository.save(plants);
  }
}
