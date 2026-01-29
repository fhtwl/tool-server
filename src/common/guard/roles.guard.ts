import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // console.log(context);
    const user = request.user;
    return matchRoles(roles, user?.roles || []);
  }
}
function matchRoles(
  roles: string[],
  roles1: string[],
): boolean | Promise<boolean> {
  return roles.some((role) => roles1.includes(role));
}
