import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { ApiOperation } from '@nestjs/swagger';
import { SignInDto } from './dtos/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { GetActiveUser } from './decorators/getActiveUser';
import { ActiveUserData } from './interface/active-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'User registration.',
  })
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Sign-in user.',
  })
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('sign-out')
  @Auth(AuthType.Bearer)
  @ApiOperation({
    summary: 'Sign-out current logged-in user.',
  })
  @HttpCode(HttpStatus.OK)
  async signOut(@GetActiveUser() user: ActiveUserData) {
    return this.authService.signOut(user.sub);
  }
}
