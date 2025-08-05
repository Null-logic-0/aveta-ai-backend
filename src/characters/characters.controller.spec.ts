/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dtos/create-character.dto';
import { UpdateCharacterDto } from './dtos/update-character.dto';
import { PaginateCharacterDto } from './dtos/paginate-character.dto';
import { ActiveUserData } from '../auth/interface/active-user.interface';
import { Role } from '../auth/enums/role.enum';
import { UserPlan } from '../subscription/enums/userPlan.enum';
import { Visibility } from './enums/visibility.enum';
import { Character } from './character.entity';

describe('CharactersController', () => {
  let controller: CharactersController;
  let service: jest.Mocked<CharactersService>;

  const mockService = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [{ provide: CharactersService, useValue: mockService }],
    }).compile();

    controller = module.get<CharactersController>(CharactersController);
    service = module.get(CharactersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser: ActiveUserData = {
    sub: 1,
    email: 'test@example.com',
    role: Role.User,
    userPlan: UserPlan.Free,
    tokenVersion: 1,
  };

  describe('getAllCharacters', () => {
    it('should call charactersService.getAll with filters and pagination and return result', async () => {
      // Replace 'Tags.Tag1' etc with your actual enum values or cast to any
      const query: PaginateCharacterDto & Record<string, any> = {
        limit: 10,
        page: 2,
        search: 'hero',
        tags: ['Tag1', 'Tag2'] as any, // or use actual enum values
      };

      const expectedFilters = { search: 'hero', tags: query.tags };
      const expectedPagination = { limit: 10, page: 2 };

      const result = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 0,
          currentPage: 2,
          totalPages: 0,
        },
        links: {
          first: '',
          previous: '',
          next: '',
          last: '',
          current: '',
        },
      };

      service.getAll.mockResolvedValue(result);

      const response = await controller.getAllCharacters(query);

      expect(service.getAll).toHaveBeenCalledWith(
        expectedFilters,
        expectedPagination,
      );
      expect(response).toEqual(result);
    });
  });

  describe('getSingleCharacter', () => {
    it('should call charactersService.getOne with characterId and userId and return result', async () => {
      const characterId = 5;

      const result = {
        id: characterId,
        characterName: 'Hero',
        avatar: 'avatar.png',
        tagline: 'Hero tagline',
        description: 'Hero description',
        tags: [],
        creator: {
          id: 1,
          email: 'creator@example.com',
          userName: '',
          role: Role.User,
          UserPlan: UserPlan.Free,
          isPaid: false,
          messagesSentToday: 0,
          lastMessageSentAt: new Date(),
          blogs: [],
          characters: [],
          chats: [],
          likedCharacters: [],
          isBlocked: false,
          tokenVersion: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        likedByUsers: [],
        visibility: Visibility.PUBLIC,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Character;

      service.getOne.mockResolvedValue(result);

      const response = await controller.getSingleCharacter(
        characterId,
        mockUser,
      );

      expect(service.getOne).toHaveBeenCalledWith(characterId, mockUser.sub);
      expect(response).toEqual(result);
    });
  });

  describe('createCharacter', () => {
    it('should call charactersService.create with userId, dto and file and return result', async () => {
      const dto: CreateCharacterDto = { characterName: 'New Hero' } as any;
      const file = { originalname: 'avatar.png' } as Express.Multer.File;
      const result = {
        id: 1,
        characterName: 'New Hero',
        avatar: 'avatar.png',
        tagline: 'A new hero',
        description: 'Description here',
        tags: [],
        creator: {
          id: 1,
          email: 'creator@example.com',
          userName: 'creatorUser',
          role: Role.User,
          userPlan: UserPlan.Free,
          isPaid: false,
          messagesSentToday: 0,
          lastMessageSentAt: new Date(),
          blogs: [],
          characters: [],
          chats: [],
          likedCharacters: [],
          isBlocked: false,
          tokenVersion: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        likedByUsers: [],
        visibility: Visibility.PUBLIC,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Character;

      service.create.mockResolvedValue(result);

      const response = await controller.createCharacter(mockUser, dto, file);

      expect(service.create).toHaveBeenCalledWith(mockUser.sub, dto, file);
      expect(response).toEqual(result);
    });
  });

  describe('updateCharacter', () => {
    it('should call charactersService.update with characterId, userId, dto and file and return result', async () => {
      const characterId = 3;
      const dto: UpdateCharacterDto = { characterName: 'Updated Hero' } as any;
      const file = { originalname: 'updated.png' } as Express.Multer.File;

      const result = {
        id: characterId,
        characterName: 'Updated Hero',
        avatar: 'avatar.png',
        tagline: 'Hero tagline',
        description: 'Hero description',
        tags: [],
        creator: {
          id: 1,
          email: 'creator@example.com',
          userName: 'creatorUser',
          role: Role.User,
          userPlan: UserPlan.Free,
          isPaid: false,
          messagesSentToday: 0,
          lastMessageSentAt: new Date(),
          blogs: [],
          characters: [],
          chats: [],
          likedCharacters: [],
          isBlocked: false,
          tokenVersion: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        likedByUsers: [],
        visibility: Visibility.PUBLIC,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Character;

      service.update.mockResolvedValue(result);

      const response = await controller.updateCharacter(
        characterId,
        mockUser,
        dto,
        file,
      );

      expect(service.update).toHaveBeenCalledWith(
        characterId,
        mockUser.sub,
        dto,
        file,
      );
      expect(response).toEqual(result);
    });
  });

  describe('deleteCharacter', () => {
    it('should call charactersService.delete with characterId and userId and return result', async () => {
      const characterId = 7;
      const result = { deleted: true, message: 'Deleted successfully' };

      service.delete.mockResolvedValue(result);

      const response = await controller.deleteCharacter(characterId, mockUser);

      expect(service.delete).toHaveBeenCalledWith(characterId, mockUser.sub);
      expect(response).toEqual(result);
    });
  });
});
