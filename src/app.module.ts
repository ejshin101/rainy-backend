import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlantModule } from './plant/plant.module';
import { UserModule } from './user/user.module';
import * as process from 'process';
import { PlantListModule } from './plantList/plantList.module';
import { UserPlntModule } from './userPlnt/user-plnt.module';
import { PlntJrnlModule } from './plntJrnl/plnt-jrnl.module';
import { AuthModule } from './user/auth/auth.module';
import { EmailVerModule } from './email/email-ver.module';

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
    UserPlntModule,
    PlntJrnlModule,
    AuthModule,
    EmailVerModule,
  ],
})
export class AppModule {}
