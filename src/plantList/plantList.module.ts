import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PlantListController } from './plantList.controller';
import { PlantListService } from './plantList.service';
import { plantRepository } from '../plant/plant.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [PlantListController],
  providers: [...plantRepository, PlantListService],
})
export class PlantListModule {}
