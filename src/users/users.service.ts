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
import { ToggleLikeCharacterProvider } from './providers/toggle-like-character.provider';
import { FetchUserCreatedCharactersProvider } from './providers/fetch-user-created-characters.provider';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { FetchUserLikedCharactersProvider } from './providers/fetch-user-liked-characters.provider';
import { GetLikeStatusProvider } from './providers/get-like-status.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,

    private readonly findOneByEmailProvider: FindByEmailProvider,

    private readonly updateUserProfileProvider: UpdateUser,

    private readonly toggleLikeCharacterProvider: ToggleLikeCharacterProvider,

    private readonly fetchAllUserCreatedCharactersProvider: FetchUserCreatedCharactersProvider,

    private readonly fetchUserLikedCharactersProvider: FetchUserLikedCharactersProvider,

    private readonly getLikeStatusProvider: GetLikeStatusProvider,
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
      throw new BadRequestException(
        error.message || 'Failed to fetch all users!',
      );
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
      throw new BadRequestException(
        error.message || 'Oops...something went wrong',
      );
    }
  }

  async findOneByEmail(email: string) {
    return await this.findOneByEmailProvider.findOneByEmail(email);
  }

  async findOneByGoogleId(googleId: string) {
    return await this.usersRepository.findOne({
      where: { googleId },
    });
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

  async toggleLike(userId: number, characterId: number) {
    return await this.toggleLikeCharacterProvider.toggleLike(
      userId,
      characterId,
    );
  }

  async getLikeStatus(characterId: number, userId: number) {
    return await this.getLikeStatusProvider.getLikeStatus(characterId, userId);
  }

  async getAllUserCharacters(
    requestUserId: number,
    pagination: PaginationQueryDto,
    targetUserId?: number,
  ) {
    return await this.fetchAllUserCreatedCharactersProvider.getAllUserCharacters(
      requestUserId,
      pagination,
      targetUserId,
    );
  }
  async getLikedCharactersByUser(
    loggedInUserId: number,
    pagination: PaginationQueryDto,
    targetUserId?: number,
  ) {
    return await this.fetchUserLikedCharactersProvider.getLikedCharactersByUser(
      loggedInUserId,
      pagination,
      targetUserId,
    );
  }
}
