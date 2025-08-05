import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from '../../characters/character.entity';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { PaginationQueryDto } from '../../common/pagination/dtos/pagination-query.dto';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { Visibility } from '../../characters/enums/visibility.enum';

@Injectable()
export class FetchUserCreatedCharactersProvider {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  async getAllUserCharacters(
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
        .leftJoinAndSelect('character.likedByUsers', 'user')
        .leftJoinAndSelect('character.creator', 'creator')
        .where('creator.id = :targetUserId', { targetUserId });

      if (targetUserId !== requestUserId) {
        query.andWhere('character.visibility = :visibility', {
          visibility: Visibility.PUBLIC,
        });
      }

      query.orderBy('character.createdAt', 'DESC');

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
