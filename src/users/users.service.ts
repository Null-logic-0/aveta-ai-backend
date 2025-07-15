import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FindByEmailProvider } from './providers/find-by-email-provider';
import { Role } from '../auth/enums/role.enum';
import { UpdateUser } from './providers/update-user.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,

    private readonly findOneByEmailProvider: FindByEmailProvider,

    private readonly updateUserProfileProvider: UpdateUser,
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

  async updateUserRole(id: number, attrs: Partial<User>) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found with this ID!');
      }

      if (
        'email' in attrs ||
        'password' in attrs ||
        'userName' in attrs ||
        'profileImage' in attrs
      ) {
        throw new NotAcceptableException(
          'Invalid update: only role can be updated.',
        );
      }
      if (!attrs.role || !Object.values(Role).includes(attrs.role)) {
        throw new NotAcceptableException('Invalid or missing role value.');
      }

      Object.assign(user, attrs);
      return this.usersRepository.save(user);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotAcceptableException
      ) {
        throw error;
      }
      throw new BadRequestException(error || 'Invalid update');
    }
  }

  async toggleBlockUser(id: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found with this ID!');
      }
      user.isBlocked = !user.isBlocked;
      await this.usersRepository.save(user);
      return {
        message: user.isBlocked
          ? `User with ID:${id} blocked successfully!`
          : `User with ID:${id} unblocked successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error || 'Failed to block user!');
    }
  }

  async updateProfile(
    id: number,
    attrs: Partial<User>,
    file?: Express.Multer.File,
  ) {
    return this.updateUserProfileProvider.update(id, attrs, file);
  }

  async deleteAccount(userId: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id: userId });
      if (!user) {
        throw new UnauthorizedException(
          'You are not logged in! Please login again.',
        );
      }
      await this.usersRepository.remove(user);
      return {
        AccountDeletion: true,
        message: `Your account:${userId} deleted successfully!`,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(error || 'Failed to delete account');
    }
  }

  async removeUser(id: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found with this ID!');
      }
      await this.usersRepository.remove(user);
      return {
        deleted: true,
        message: `User with this ID:${id} deleted successfully!`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error || 'Failed to delete user');
    }
  }
}
