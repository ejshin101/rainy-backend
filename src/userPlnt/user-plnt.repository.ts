import { DataSource } from 'typeorm';
import { UserPlnt } from './user-plnt.entity';

export const userPlntRepository = [
  {
    provide: 'USER_PLNT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserPlnt),
    inject: ['DATA_SOURCE'],
  },
];
