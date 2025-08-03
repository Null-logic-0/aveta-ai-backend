import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCharacterProvider } from './providers/create-character.provider';
import { Repository } from 'typeorm';
import { Character } from './character.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCharacterDto } from './dtos/create-character.dto';
import { UpdateCharacterProvider } from './providers/update-character.provider';
import { UpdateCharacterDto } from './dtos/update-character.dto';
import { DeleteCharacterProvider } from './providers/delete-character.provider';
import { GetAllCharactersFilterDto } from './dtos/get-all-characters-filter.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Visibility } from './enums/visibility.enum';
import { PaginateCharacterDto } from './dtos/paginate-character.dto';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,

    private readonly createCharacterProvider: CreateCharacterProvider,

    private readonly updateCharacterProvider: UpdateCharacterProvider,

    private readonly deleteCharacterProvider: DeleteCharacterProvider,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  async create(
    userId: number,
    createCharacterDto: CreateCharacterDto,
    file: Express.Multer.File,
  ) {
    return this.createCharacterProvider.create(
      userId,
      createCharacterDto,
      file,
    );
  }

  async update(
    characterId: number,
    userId: number,
    updateCharacterDto: UpdateCharacterDto,
    file?: Express.Multer.File,
  ) {
    return this.updateCharacterProvider.update(
      characterId,
      userId,
      updateCharacterDto,
      file,
    );
  }

  async getAll(
    filters: GetAllCharactersFilterDto,
    paginateCharacters: PaginateCharacterDto,
  ) {
    try {
      const query = this.characterRepository
        .createQueryBuilder('character')
        .leftJoinAndSelect('character.creator', 'creator')
        .leftJoinAndSelect('character.likedByUsers', 'likedByUsers')
        .where('character.visibility = :visibility', {
          visibility: Visibility.PUBLIC,
        });

      if (filters.tags?.length) {
        query.andWhere(
          'character.tags && ARRAY[:...tags]::character_tags_enum[]',
          {
            tags: filters.tags,
          },
        );
      }

      if (filters.search) {
        query.andWhere(
          '(LOWER(character.characterName) LIKE LOWER(:search) OR LOWER(character.description) LIKE LOWER(:search))',
          { search: `%${filters.search}%` },
        );
      }

      return await this.paginationProvider.paginateQuery(
        {
          limit: paginateCharacters?.limit,
          page: paginateCharacters?.page,
        },
        query,
      );
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to fetch characters!',
      );
    }
  }

  async getOne(characterId: number, userId?: number) {
    try {
      const character = await this.characterRepository.findOne({
        where: { id: characterId },
        relations: ['creator'],
      });

      if (!character) {
        throw new NotFoundException('Oops... Character not found!');
      }

      if (
        character.visibility !== Visibility.PUBLIC &&
        character.creator.id !== userId
      ) {
        throw new UnauthorizedException(
          'You are not authorized to view this private character.',
        );
      }
      return character;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Oops... something went wrong!',
      );
    }
  }

  async delete(characterId: number, userId: number) {
    return this.deleteCharacterProvider.delete(characterId, userId);
  }
}
