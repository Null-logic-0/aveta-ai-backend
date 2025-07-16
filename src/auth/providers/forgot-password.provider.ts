import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { MailService } from '../../mail/providers/mail.service';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';

@Injectable()
export class ForgotPasswordProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly mailService: MailService,

    private readonly configService: ConfigService,
  ) {}

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.usersService.findOneByEmail(
        forgotPasswordDto.email,
      );

      if (!user) {
        throw new NotFoundException('There is no user with this email!');
      }

      const jwtSecret = this.configService.get<string>('appConfig.jwtSecret');
      if (!jwtSecret) {
        throw new InternalServerErrorException(
          'JWT secret is not defined in configuration',
        );
      }

      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: '10m',
      });
      const frontendUrl =
        this.configService.get('appConfig.frontendUrl') ||
        'http://localhost:3000';

      const resetLink = `${frontendUrl}/reset-password?token=${token}`;

      await this.mailService.sendPasswordReset(user, resetLink);

      return { message: 'Reset link sent to email' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new BadRequestException(error || 'Oops,Something went wrong!');
    }
  }
}
