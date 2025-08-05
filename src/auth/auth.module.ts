import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { BcryptProvider } from './providers/bcrypt.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { SignUpProvider } from './providers/sign-up.provider';
import { SignOutProvider } from './providers/sign-out.provider';
import { HashingProvider } from './providers/hashing.provider';
import { UpdatePassword } from './providers/update-password.provider';
import { ResetPasswordProvider } from './providers/reset-password.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { ForgotPasswordProvider } from './providers/forgot-password.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';
import { GoogleAuthenticationService } from './social/google-authentication.service';
import { GoogleAuthenticationController } from './social/google-authentication.controller';

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
    RefreshTokensProvider,
  ],
  exports: [
    AuthService,
    HashingProvider,
    GoogleAuthenticationService,
    CreateGoogleUserProvider,
  ],
})
export class AuthModule {}
