import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'aws-sdk/clients/budgets';
import { ROLES_KEY } from '../../../auth/constants/auth.constants';
import { ActiveUserData } from '../../interface/active-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as ActiveUserData;

    const role = requiredRoles.includes(user.role);
    if (!user || !role) {
      throw new ForbiddenException(
        `Access denied: only [${requiredRoles.join(', ')}] roles are allowed`,
      );
    }
    return role;
  }
}
