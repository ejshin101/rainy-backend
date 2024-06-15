import { Module } from '@nestjs/common';
import { UserService } from '../user.service';
import { userRepository } from '../user.repository';
import { DatabaseModule } from '../../database/database.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStratege } from './passport.jwt.stratege';
import * as process from 'process';


@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    //JWT Module
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(process.env.JWT_SECRET),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...userRepository,
    UserService,
    AuthService,
    JwtModule,
    JwtStratege,
  ],
})
export class AuthModule {}
