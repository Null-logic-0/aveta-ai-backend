import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from '../dtos/sign-in.dto';
import {
  BadRequestException,
  forwardRef,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';

export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  async singIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);

    let isEqual: boolean = false;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password!,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }

    if (!isEqual) {
      throw new UnauthorizedException('Invalid password');
    }

    if (user.isBlocked) {
      throw new UnauthorizedException(
        'Your account has been blocked by admin.Please,contact support.',
      );
    }

    const tokens = await this.generateTokensProvider.generateToken(user);

    return {
      tokens,
      user,
    };
  }
}
