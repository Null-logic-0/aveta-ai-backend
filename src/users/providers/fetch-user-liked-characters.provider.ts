import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from 'src/characters/character.entity';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { Visibility } from 'src/characters/enums/visibility.enum';

@Injectable()
export class FetchUserLikedCharactersProvider {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  async getLikedCharactersByUser(
    requestUserId: number,
    pagination: PaginationQueryDto,
    targetUserId?: number,
  ) {
    try {
      const user = await this.userRepository.findOneBy({ id: requestUserId });
      if (!user) {
        throw new UnauthorizedException(
          'Invalid credentials,Please sign in again.',
        );
      }

      const query = this.characterRepository
        .createQueryBuilder('character')
        .leftJoin('character.likedByUsers', 'likedUserFilter')
        .leftJoinAndSelect('character.likedByUsers', 'likedUser')
        .leftJoinAndSelect('character.creator', 'creator')
        .where('likedUserFilter.id = :targetUserId', { targetUserId });

      if (targetUserId !== requestUserId) {
        query.andWhere('character.visibility = :visibility', {
          visibility: Visibility.PUBLIC,
        });
      }

      const result = await this.paginationProvider.paginateQuery(
        {
          limit: pagination?.limit,
          page: pagination?.page,
        },
        query,
      );
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Oops... something went wrong!',
      );
    }
  }
}
