import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const accessToken = request.cookies['access_token'];
      const user = await this.jwtService.verify(accessToken);
      request.user = user;
      return user;
    } catch (err) {
      return false;
    }
  }
}
