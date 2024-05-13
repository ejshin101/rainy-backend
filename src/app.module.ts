import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlantModule } from './plant/plant.module';
import { UserModule } from './user/user.module';
import * as process from 'process';
import { PlantListModule } from './plantList/plantList.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV == 'dev' ? `.env.dev` : `.env.test`,
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
    }),
    PlantModule,
    UserModule,
    PlantListModule,
  ],
})
export class AppModule {}
