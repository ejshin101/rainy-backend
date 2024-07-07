import { DataSource } from 'typeorm';
import { EmailVer } from './email-ver.entity';

export const emailVerRepository = [
  {
    provide: 'EMAIL_VER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(EmailVer),
    inject: ['DATA_SOURCE'],
  },
];
