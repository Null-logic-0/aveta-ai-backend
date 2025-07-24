import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from 'src/users/users.service';
import { GenerateTokensProvider } from '../providers/generate-tokens.provider';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleAuthenticationService {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly usersService: UsersService,

    private readonly authService: AuthService,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  private getOauthClient(): OAuth2Client {
    if (!this.oauthClient) {
      const clientId = this.jwtConfiguration.googleClientId;
      const clientSecret = this.jwtConfiguration.googleSecret;
      this.oauthClient = new OAuth2Client(clientId, clientSecret);
    }
    return this.oauthClient;
  }

  async googleAuth(googleTokenDto: GoogleTokenDto) {
    try {
      const oauthClient = this.getOauthClient();

      const ticket = await oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid Google token payload');
      }

      const {
        email,
        sub: googleId,
        name: userName,
        picture: profileImage,
      } = payload;

      let user = await this.usersService.findOneByGoogleId(googleId);

      if (!user) {
        if (!email || !googleId || !userName) {
          throw new UnauthorizedException(
            'Missing required Google profile fields',
          );
        }
        user = await this.authService.createGoogleUser({
          email,
          userName,
          googleId,
          profileImage,
        });
      }
      const tokens = await this.generateTokensProvider.generateToken(user);
      return {
        ...tokens,
        user,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
