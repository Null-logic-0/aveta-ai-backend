import { Injectable } from '@nestjs/common';
import { SignUpProvider } from './providers/sign-up.provider';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { SignInProvider } from './providers/sign-in.provider';
import { SignOutProvider } from './providers/sign-out.provider';
import { UpdatePassword } from './providers/update-password.provider';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { ForgotPasswordProvider } from './providers/forgot-password.provider';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ResetPasswordProvider } from './providers/reset-password.provider';
import { GoogleUser } from './interface/google-user.interface';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly signUpProvider: SignUpProvider,

    private readonly signInProvider: SignInProvider,

    private readonly signOutProvider: SignOutProvider,

    private readonly updatePasswordProvider: UpdatePassword,

    private readonly forgotPasswordProvider: ForgotPasswordProvider,

    private readonly resetPasswordProvider: ResetPasswordProvider,

    private readonly createGoogleUserProvider: CreateGoogleUserProvider,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    return this.signUpProvider.signup(signUpDto);
  }

  async signIn(signIn: SignInDto) {
    return this.signInProvider.singIn(signIn);
  }

  async createGoogleUser(googleUser: GoogleUser) {
    return await this.createGoogleUserProvider.createGoogleUser(googleUser);
  }

  async signOut(userId: number) {
    return this.signOutProvider.signOut(userId);
  }

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    return this.updatePasswordProvider.updatePassword(
      userId,
      updatePasswordDto,
    );
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.forgotPasswordProvider.forgotPassword(forgotPasswordDto);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, token: string) {
    return this.resetPasswordProvider.resetPassword(resetPasswordDto, token);
  }
}
