import { Injectable } from '@nestjs/common';
import { SignUpProvider } from './providers/sign-up.provider';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { SignInProvider } from './providers/sign-in.provider';
import { SignOutProvider } from './providers/sign-out.provider';
import { UpdatePassword } from './providers/update-password.provider';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly signUpProvider: SignUpProvider,

    private readonly signInProvider: SignInProvider,

    private readonly signOutProvider: SignOutProvider,

    private readonly updatePasswordProvider: UpdatePassword,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    return this.signUpProvider.signup(signUpDto);
  }

  async signIn(signIn: SignInDto) {
    return this.signInProvider.singIn(signIn);
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
}
