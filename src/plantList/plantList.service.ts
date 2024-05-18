import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as convert from 'xml-js';
import { Repository } from 'typeorm';
import { Plant } from '../plant/plant.entity';
import { CreatePlantDto } from '../plant/dto/create-plant.dto';
import axios from 'axios';


@Injectable()
export class PlantListService {
  constructor(
    @Inject('PLANT_REPOSITORY')
    private plantRepository: Repository<Plant>,
  ) {}

  async getGardenList(numOfRows: number = 300): Promise<any> {
    // const SERVICE_KEY = process.env.SERVICE_KEY;
    const HOST = 'http://api.nongsaro.go.kr/service/garden/gardenList';
    const requestUrl = `${HOST}?apiKey=20240314PVW7TR5JZOBS5WR1G2VZMG&numOfRows=${numOfRows}`;

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
    console.log(gardenList);
    console.log(gardenList.response);
    for (let idx = 0; idx < gardenList.response.body.items.item.length; idx++) {
      const plantName =
        gardenList.response.body.items.item[idx].cntntsSj['_cdata'];
      const plantDto = new CreatePlantDto(idx + 1, plantName);
      const plant = await this.plantRepository.create(plantDto);
      plants.push(plant);
    }
    // 모든 식물 저장 후, 저장된 식물 배열 반환
    return this.plantRepository.save(plants);
  }
}
