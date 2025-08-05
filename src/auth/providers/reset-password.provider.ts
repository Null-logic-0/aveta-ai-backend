import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from './hashing.provider';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResetPasswordProvider {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingPasswordProvider: HashingProvider,

    private readonly configService: ConfigService,
  ) {}

  async resetPassword(resetPasswordDto: ResetPasswordDto, token: string) {
    try {
      const jwtSecret = this.configService.get<string>('appConfig.jwtSecret');
      if (!jwtSecret) {
        throw new InternalServerErrorException(
          'JWT secret is not defined in configuration',
        );
      }
      const payload = jwt.verify(token, jwtSecret) as {
        userId: number;
      };
      const user = await this.usersRepository.findOneBy({ id: payload.userId });

      if (!user) throw new BadRequestException('Invalid token');

      user.password = await this.hashingPasswordProvider.hashPassword(
        resetPasswordDto.newPassword,
      );
      await this.usersRepository.save(user);
      return { message: 'Password has changed successfully!' };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Oops,Something went wrong!',
      );
    }
  }
}
