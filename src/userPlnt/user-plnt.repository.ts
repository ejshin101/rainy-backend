import { DataSource } from 'typeorm';
import { PlntJrnl } from './plnt-jrnl.entity';

export const userPlntRepository = [
  {
    provide: 'USER_PLNT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PlntJrnl),
    inject: ['DATA_SOURCE'],
  },
];
