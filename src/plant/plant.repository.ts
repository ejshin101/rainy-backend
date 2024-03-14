import { DataSource } from 'typeorm';
import { Plant } from './plant.entity';

export const plantRepository = [
  {
    provide: 'PLANT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Plant),
    inject: ['DATA_SOURCE'],
  },
];
