import { forwardRef, Module } from '@nestjs/common';
import { SignUpProvider } from './providers/sign-up.provider';

import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { SignInProvider } from './providers/sign-in.provider';
import { SignOutProvider } from './providers/sign-out.provider';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SignUpProvider,
    SignInProvider,
    SignOutProvider,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    GenerateTokensProvider,
  ],
  exports: [AuthService, HashingProvider],
})
export class AuthModule {}
