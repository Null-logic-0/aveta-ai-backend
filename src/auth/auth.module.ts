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
import { UpdatePassword } from './providers/update-password.provider';
import { ForgotPasswordProvider } from './providers/forgot-password.provider';
import { ResetPasswordProvider } from './providers/reset-password.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';
import { GoogleAuthenticationController } from './social/google-authentication.controller';
import { GoogleAuthenticationService } from './social/google-authentication.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController, GoogleAuthenticationController],
  providers: [
    AuthService,
    SignUpProvider,
    SignInProvider,
    SignOutProvider,
    GoogleAuthenticationService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    GenerateTokensProvider,
    UpdatePassword,
    ForgotPasswordProvider,
    ResetPasswordProvider,
    CreateGoogleUserProvider,
  ],
  exports: [
    AuthService,
    HashingProvider,
    GoogleAuthenticationService,
    CreateGoogleUserProvider,
  ],
})
export class AuthModule {}
