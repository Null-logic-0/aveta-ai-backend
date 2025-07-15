import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UpdatePasswordDto } from '../dtos/update-password.dto';

@Injectable()
export class UpdatePassword {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}
  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException(
        'You are not logged-in,Please log-in again!',
      );
    }

    const isOldPasswordValid = await this.hashingProvider.comparePassword(
      updatePasswordDto.currentPassword,
      user.password!,
    );

    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect!');
    }

    if (updatePasswordDto.newPassword !== updatePasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match!');
    }

    user.password = await this.hashingProvider.hashPassword(
      updatePasswordDto.newPassword,
    );

    await this.usersRepository.save(user);
    const tokens = await this.generateTokensProvider.generateToken(user);

    return { tokens, message: 'Password updated successfully!' };
  }
}
