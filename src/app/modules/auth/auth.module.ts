import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtStrategy } from './stretagy/jwt.stretagy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),  // Ensure PassportModule is registered with 'jwt'

  ],
  
  controllers: [AuthController],
  providers: [AuthService,UserService,JwtService,JwtStrategy,
        {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
],

})
export class AuthModule {}
