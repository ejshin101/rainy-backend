import { Module } from '@nestjs/common';
import { PlantController } from './plant.controller';
import { PlantService } from './plant.service';
import { plantRepository } from './plant.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PlantController],
  providers: [...plantRepository, PlantService],
})
export class PlantModule {}
