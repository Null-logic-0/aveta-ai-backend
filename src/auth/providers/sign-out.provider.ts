import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { Repository } from 'typeorm';
import { TOKEN_VERSION_KEY } from '../constants/auth.constants';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class SignOutProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async signOut(userId: number): Promise<{ message: string }> {
    try {
      const result = await this.usersRepository.increment(
        { id: userId },
        TOKEN_VERSION_KEY,
        1,
      );

      if (result.affected === 0) {
        throw new UnauthorizedException('You are not logged-in!');
      }
      return { message: 'Successfully signed out' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to sign out!');
    }
  }
}
