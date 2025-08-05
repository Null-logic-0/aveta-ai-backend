/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CharactersService } from './characters.service';
import { Repository } from 'typeorm';
import { Character } from './character.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCharacterProvider } from './providers/create-character.provider';
import { UpdateCharacterProvider } from './providers/update-character.provider';
import { DeleteCharacterProvider } from './providers/delete-character.provider';
import { PaginationProvider } from '../common/pagination/providers/pagination.provider';
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Visibility } from './enums/visibility.enum';

describe('CharactersService', () => {
  let service: CharactersService;
  let characterRepository: jest.Mocked<Repository<Character>>;
  let createCharacterProvider: jest.Mocked<CreateCharacterProvider>;
  let updateCharacterProvider: jest.Mocked<UpdateCharacterProvider>;
  let deleteCharacterProvider: jest.Mocked<DeleteCharacterProvider>;
  let paginationProvider: jest.Mocked<PaginationProvider>;

  beforeEach(async () => {
    const mockRepository = {
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
    };

    const mockCreateCharacterProvider = {
      create: jest.fn(),
    };

    const mockUpdateCharacterProvider = {
      update: jest.fn(),
    };

    const mockDeleteCharacterProvider = {
      delete: jest.fn(),
    };

    const mockPaginationProvider = {
      paginateQuery: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: getRepositoryToken(Character),
          useValue: mockRepository,
        },
        {
          provide: CreateCharacterProvider,
          useValue: mockCreateCharacterProvider,
        },
        {
          provide: UpdateCharacterProvider,
          useValue: mockUpdateCharacterProvider,
        },
        {
          provide: DeleteCharacterProvider,
          useValue: mockDeleteCharacterProvider,
        },
        {
          provide: PaginationProvider,
          useValue: mockPaginationProvider,
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
    characterRepository = module.get(getRepositoryToken(Character));
    createCharacterProvider = module.get(CreateCharacterProvider);
    updateCharacterProvider = module.get(UpdateCharacterProvider);
    deleteCharacterProvider = module.get(DeleteCharacterProvider);
    paginationProvider = module.get(PaginationProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call createCharacterProvider.create and return result', async () => {
      const userId = 1;
      const dto = { characterName: 'Test' } as any;
      const file = {} as Express.Multer.File;
      const createdCharacter: Character = {
        id: 1,
        characterName: 'Test',
        avatar: 'avatar.png',
        tagline: 'tagline',
        description: 'description',
        tags: [],
        visibility: Visibility.PUBLIC,
        creator: { id: userId, email: 'creator@example.com' } as any,
        likedByUsers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        chats: [],
      };

      createCharacterProvider.create.mockResolvedValue(createdCharacter);

      const result = await service.create(userId, dto, file);

      expect(createCharacterProvider.create).toHaveBeenCalledWith(
        userId,
        dto,
        file,
      );
      expect(result).toBe(createdCharacter);
    });
  });

  describe('update', () => {
    it('should call updateCharacterProvider.update and return result', async () => {
      const characterId = 1;
      const userId = 1;
      const dto = { characterName: 'Updated' } as any;
      const file = {} as Express.Multer.File;
      const updatedCharacter: Character = {
        id: 1,
        characterName: 'Test updated',
        avatar: 'avatar.png',
        tagline: 'tagline',
        description: 'description',
        tags: [],
        visibility: Visibility.PUBLIC,
        creator: { id: userId, email: 'creator@example.com' } as any,
        likedByUsers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        chats: [],
      };

      updateCharacterProvider.update.mockResolvedValue(updatedCharacter);

      const result = await service.update(characterId, userId, dto, file);

      expect(updateCharacterProvider.update).toHaveBeenCalledWith(
        characterId,
        userId,
        dto,
        file,
      );
      expect(result).toBe(updatedCharacter);
    });
  });

  describe('getAll', () => {
    it('should call paginationProvider.paginateQuery with correct params', async () => {
      const filters = { tags: ['tag1'], search: 'test' } as any;
      const paginateDto = { limit: 10, page: 1 } as any;

      // Mock query builder
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      };

      characterRepository.createQueryBuilder.mockReturnValue(
        queryBuilder as any,
      );
      paginationProvider.paginateQuery.mockResolvedValue({
        data: [],
        meta: {
          itemsPerPage: 0,
          totalItems: 0,
          currentPage: 0,
          totalPages: 0,
        },
        links: {
          first: '',
          previous: '',
          next: '',
          last: '',
          current: '',
        },
      });

      const result = await service.getAll(filters, paginateDto);

      expect(characterRepository.createQueryBuilder).toHaveBeenCalledWith(
        'character',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'character.creator',
        'creator',
      );
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'character.likedByUsers',
        'likedByUsers',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'character.visibility = :visibility',
        {
          visibility: Visibility.PUBLIC,
        },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'character.tags && ARRAY[:...tags]::character_tags_enum[]',
        { tags: filters.tags },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        '(LOWER(character.characterName) LIKE LOWER(:search) OR LOWER(character.description) LIKE LOWER(:search))',
        { search: `%${filters.search}%` },
      );
      expect(paginationProvider.paginateQuery).toHaveBeenCalledWith(
        { limit: paginateDto.limit, page: paginateDto.page },
        queryBuilder,
      );
      expect(result).toEqual({
        data: [],
        meta: {
          itemsPerPage: 0,
          totalItems: 0,
          currentPage: 0,
          totalPages: 0,
        },
        links: {
          first: '',
          previous: '',
          next: '',
          last: '',
          current: '',
        },
      });
    });

    it('should throw BadRequestException if error occurs', async () => {
      characterRepository.createQueryBuilder.mockImplementation(() => {
        throw new Error('DB Error');
      });

      await expect(service.getAll({}, { limit: 10, page: 1 })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getOne', () => {
    it('should return character if found and visible or owned by user', async () => {
      const character = {
        id: 1,
        visibility: Visibility.PUBLIC,
        creator: { id: 1 },
      } as Character;

      characterRepository.findOne.mockResolvedValue(character);

      const result = await service.getOne(1, 2);
      expect(characterRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['creator'],
      });
      expect(result).toBe(character);
    });

    it('should throw NotFoundException if character not found', async () => {
      characterRepository.findOne.mockResolvedValue(null);

      await expect(service.getOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if character is private and user is not owner', async () => {
      const character = {
        id: 1,
        visibility: Visibility.PRIVATE,
        creator: { id: 2 },
      } as Character;

      characterRepository.findOne.mockResolvedValue(character);

      await expect(service.getOne(1, 1)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException on unknown errors', async () => {
      characterRepository.findOne.mockRejectedValue(new Error('Unknown error'));

      await expect(service.getOne(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should call deleteCharacterProvider.delete with correct params', async () => {
      const characterId = 1;
      const userId = 2;

      deleteCharacterProvider.delete.mockResolvedValue({
        deleted: true,
        message: 'Character deleted successfully',
      });

      const result = await service.delete(characterId, userId);

      expect(deleteCharacterProvider.delete).toHaveBeenCalledWith(
        characterId,
        userId,
      );
      expect(result).toEqual({
        deleted: true,
        message: 'Character deleted successfully',
      });
    });
  });
});
