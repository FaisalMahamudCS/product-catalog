// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../../../common/decorators/roles.decorator';
import { Role } from '../../../../common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from metadata
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Public route if no roles are specified
    }

    // Extract user from request
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      return false; // Access denied if no user or role is defined
    }

    return requiredRoles.includes(user.role); // Check if user has a required role
  }
}
