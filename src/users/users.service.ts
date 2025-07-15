import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FindByEmailProvider } from './providers/find-by-email-provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,

    private readonly findOneByEmailProvider: FindByEmailProvider,
  ) {}

  getAll(currentUserId: number) {
    try {
      return this.usersRepository.find({
        where: { id: Not(currentUserId) },
        order: {
          updatedAt: 'DESC',
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getOne(id: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found with this ID!');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  findOneByEmail(email: string) {
    return this.findOneByEmailProvider.findOneByEmail(email);
  }
}
