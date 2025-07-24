import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ActiveUserData } from '../interface/active-user.interface';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    private readonly jwtService: JwtService,

    private readonly usersService: UsersService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.usersService.getOne(sub);

      return await this.generateTokensProvider.generateToken(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
