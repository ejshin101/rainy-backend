import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'stmp.gmail.com',
        port: 587,
        auth: {
          user: 'rainy.green.ad@gmail.com',
          pass: 'sgj.plants.0512',
        },
      },
      defaults: {
        from: '"비밀번호 초기화 이메일입니다." <rainy.green.ad@gmail.com>',
      },
      template: {
        dir: __dirname + '/../common/email-templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class EmailVerModule {}
