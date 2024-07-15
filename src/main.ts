import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessGuard } from './user/auth/jwt-access.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api'); // global prefix
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // 타입 추론을 통한 자동 변환 활성화
      },
    }),
  );

  //CORS 설정
  app.enableCors({
    origin: 'http://localhost:5000', // React 앱이 실행되는 주소
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  //jwt access token 전역 적용
  const jwtService = app.get(JwtService);
  app.useGlobalGuards(new JwtAccessGuard(jwtService, new Reflector()));

  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
