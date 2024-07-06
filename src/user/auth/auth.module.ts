import { Module } from '@nestjs/common';
import { UserService } from '../user.service';
import { userRepository } from '../user.repository';
import { DatabaseModule } from '../../database/database.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import * as process from 'process';
import { JwtAccessGuard } from './jwt-access.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { JwtRefreshStrategy } from './auth-refresh.strategy';


@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({}),
    //JWT Module
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // secret: config.get<string>(process.env.JWT_ACCESS_SECRET),
        secret: 'JWT_ACCESS_SECRET',
        // signOptions: { expiresIn: config.get<string>(process.env.JWT_ACCESS_EXPIRE) },
        signOptions: { expiresIn: '1d' }, //20s
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...userRepository,
    UserService,
    AuthService,
    JwtModule,
    JwtRefreshStrategy,
    JwtAccessGuard,
    JwtRefreshGuard,
  ],
})
export class AuthModule {}
