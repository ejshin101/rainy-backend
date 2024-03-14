import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlantModule } from './plant/plant.module';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV == 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    PlantModule,
  ],
})
export class AppModule {}
