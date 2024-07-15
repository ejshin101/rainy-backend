import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailVerController } from './email-ver.controller';
import { emailVerRepository } from './email-ver.repository';
import { EmailVerService } from './email-ver.service';
import { DatabaseModule } from '../database/database.module';
import { UserService } from '../user/user.service';
import { userRepository } from '../user/user.repository';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import process from 'process';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        },
        defaults: {
          from: '"Rainy Green 인증 이메일입니다." <' + process.env.EMAIL_USER + '>',
        },
        template: {
          dir: join(process.cwd(), 'src', 'common', 'email-templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
  ],
  controllers: [EmailVerController],
  providers: [
    ...emailVerRepository,
    ...userRepository,
    EmailVerService,
    UserService,
  ],
})
export class EmailVerModule {}
