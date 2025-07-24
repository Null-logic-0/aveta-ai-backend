import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './google-authentication.service';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import { ApiOperation } from '@nestjs/swagger';

@Auth(AuthType.None)
@Controller('google-auth')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthService: GoogleAuthenticationService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Sign-up user with google account.',
  })
  async googleAuth(@Body() googleTokenDto: GoogleTokenDto) {
    return await this.googleAuthService.googleAuth(googleTokenDto);
  }
}
