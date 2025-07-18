import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { ApiOperation } from '@nestjs/swagger';
import { SignInDto } from './dtos/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { GetActiveUser } from './decorators/getActiveUser';
import { ActiveUserData } from './interface/active-user.interface';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

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
    return await this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Sign-in user.',
  })
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Post('sign-out')
  @Auth(AuthType.Bearer)
  @ApiOperation({
    summary: 'Sign-out current logged-in user.',
  })
  @HttpCode(HttpStatus.OK)
  async signOut(@GetActiveUser() user: ActiveUserData) {
    return await this.authService.signOut(user.sub);
  }

  @Patch('update-password')
  @Auth(AuthType.Bearer)
  @ApiOperation({
    summary: 'Update current logged-in user password!',
  })
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @GetActiveUser() user: ActiveUserData,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.authService.updatePassword(user.sub, updatePasswordDto);
  }

  @Post('forgot-password')
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Forgot password!',
  })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Reset password!',
  })
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Query('token') token: string,
  ) {
    return await this.authService.resetPassword(resetPasswordDto, token);
  }
}
