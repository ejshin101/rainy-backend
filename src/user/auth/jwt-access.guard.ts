import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/public.decorator';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 경로에 @PublicDecorator 데코레이터가 있는지 확인
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log('Public route');
      return true; // 공개 경로는 접근 허용
    }

    // 공개 경로가 아닌 경우 토큰 검증
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!accessToken) {
      console.log('No access token');
      return false; // 토큰이 없는 경우 접근 불가
    }

    try {
      const user = await this.jwtService.verify(accessToken);
      request.user = user;
      console.log('Access token valid');
      return true;
    } catch (err) {
      console.log('Access token invalid', err);
      return false;
    }
  }
}
