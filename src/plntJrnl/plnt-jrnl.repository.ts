import { DataSource } from 'typeorm';
import { PlntJrnl } from './plnt-jrnl.entity';

export const plntJrnlRepository = [
  {
    provide: 'PLNT_JRNL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PlntJrnl),
    inject: ['DATA_SOURCE'],
  },
];
