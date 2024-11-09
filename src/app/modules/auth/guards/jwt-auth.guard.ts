import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Ensure JWT validation
        const isAuthValid = await super.canActivate(context);
        if (!isAuthValid) {
            throw new UnauthorizedException('Invalid authentication');
        }

        // Custom validation: Check if user exists on the request
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log('user',user)

        if (!user) {
            throw new UnauthorizedException('User not found in request');
        }

        // Additional custom validation, e.g., checking specific roles or user data
        // if you need specific conditions to be met for the user:
        // if (user.role !== 'admin') {
        //    throw new UnauthorizedException('Admin role required');
        // }

        return true; // Proceed if all checks pass
    }
}
