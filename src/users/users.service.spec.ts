import { User } from './user.entity';
import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../auth/enums/role.enum';
import {
  BadRequestException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindByEmailProvider } from './providers/find-by-email-provider';
import { UpdateUser } from './providers/update-user.provider';
import { ToggleLikeCharacterProvider } from './providers/toggle-like-character.provider';
import { FetchUserCreatedCharactersProvider } from './providers/fetch-user-created-characters.provider';
import { FetchUserLikedCharactersProvider } from './providers/fetch-user-liked-characters.provider';
import { GetLikeStatusProvider } from './providers/get-like-status.provider';

const mockFindOneByEmailProvider = { findOneByEmail: jest.fn() };
const mockUpdateUserProfileProvider = { update: jest.fn() };
const mockToggleLikeCharacterProvider = { toggleLike: jest.fn() };
const mockFetchUserCreatedCharactersProvider = {
  getAllUserCharacters: jest.fn(),
};
const mockFetchUserLikedCharactersProvider = {
  getLikedCharactersByUser: jest.fn(),
};
const mockGetLikeStatusProvider = { getLikeStatus: jest.fn() };

const mockUserRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        {
          provide: FindByEmailProvider,
          useValue: mockFindOneByEmailProvider,
        },
        { provide: UpdateUser, useValue: mockUpdateUserProfileProvider },
        {
          provide: ToggleLikeCharacterProvider,
          useValue: mockToggleLikeCharacterProvider,
        },
        {
          provide: FetchUserCreatedCharactersProvider,
          useValue: mockFetchUserCreatedCharactersProvider,
        },
        {
          provide: FetchUserLikedCharactersProvider,
          useValue: mockFetchUserLikedCharactersProvider,
        },
        {
          provide: GetLikeStatusProvider,
          useValue: mockGetLikeStatusProvider,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getAll', () => {
    it('should return all users except current', async () => {
      mockUserRepository.find.mockResolvedValueOnce(['user1']);
      const users = await service.getAll(1);
      expect(users).toEqual(['user1']);
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        where: { id: expect.anything() },
        order: { updatedAt: 'DESC' },
      });
    });

    it('should throw if fetch fails', async () => {
      mockUserRepository.find.mockRejectedValueOnce(
        new BadRequestException('Failed to fetch all users!'),
      );
      await expect(service.getAll(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getOne', () => {
    it('should return a user by ID', async () => {
      mockUserRepository.findOneBy.mockResolvedValueOnce({ id: 1 });
      const user = await service.getOne(1);
      expect(user).toEqual({ id: 1 });
    });

    it('should throw NotFoundException if not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(service.getOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on error', async () => {
      mockUserRepository.findOneBy.mockRejectedValueOnce(new Error('fail'));
      await expect(service.getOne(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateUserRole', () => {
    it('should update the user role', async () => {
      const user = { id: 2, role: Role.User };
      mockUserRepository.findOneBy.mockResolvedValueOnce(user);
      mockUserRepository.save.mockResolvedValueOnce({
        ...user,
        role: Role.Admin,
      });
      const result = await service.updateUserRole(2, { role: Role.Admin });
      expect(result).toEqual({ ...user, role: Role.Admin });
    });

    it('should throw if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(
        service.updateUserRole(2, { role: Role.Admin }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject update of non-role fields', async () => {
      mockUserRepository.findOneBy.mockResolvedValueOnce({ id: 1 });
      await expect(
        service.updateUserRole(1, { email: 'test@test.com' } as any),
      ).rejects.toThrow(NotAcceptableException);
    });

    it('should reject invalid roles', async () => {
      mockUserRepository.findOneBy.mockResolvedValueOnce({ id: 1 });
      await expect(
        service.updateUserRole(1, { role: 'invalid' as any }),
      ).rejects.toThrow(NotAcceptableException);
    });
  });

  describe('toggleBlockUser', () => {
    it('should toggle user block status', async () => {
      const user = { id: 1, isBlocked: false };
      mockUserRepository.findOneBy.mockResolvedValueOnce(user);
      mockUserRepository.save.mockResolvedValueOnce({
        ...user,
        isBlocked: true,
      });

      const result = await service.toggleBlockUser(1);
      expect(result.message).toContain('blocked');
    });

    it('should throw NotFoundException if not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(service.toggleBlockUser(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should call update provider', async () => {
      mockUpdateUserProfileProvider.update.mockResolvedValueOnce('updated');
      const result = await service.updateProfile(
        1,
        { userName: 'John Doe' },
        undefined,
      );
      expect(result).toBe('updated');
    });
  });

  describe('deleteAccount', () => {
    it('should delete account', async () => {
      const user = { id: 1 };
      mockUserRepository.findOneBy.mockResolvedValueOnce(user);
      mockUserRepository.remove.mockResolvedValueOnce(user);

      const result = await service.deleteAccount(1);
      expect(result.message).toContain('deleted successfully');
    });

    it('should throw if not logged in', async () => {
      mockUserRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(service.deleteAccount(1)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('removeUser', () => {
    it('should delete user by admin', async () => {
      const user = { id: 1 };
      mockUserRepository.findOneBy.mockResolvedValueOnce(user);
      mockUserRepository.remove.mockResolvedValueOnce(user);

      const result = await service.removeUser(1);
      expect(result.deleted).toBe(true);
    });

    it('should throw if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValueOnce(null);
      await expect(service.removeUser(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleLike', () => {
    it('should toggle like', async () => {
      mockToggleLikeCharacterProvider.toggleLike.mockResolvedValueOnce('liked');
      const result = await service.toggleLike(1, 2);
      expect(result).toBe('liked');
    });
  });

  describe('getLikeStatus', () => {
    it('should return like status', async () => {
      mockGetLikeStatusProvider.getLikeStatus.mockResolvedValueOnce(true);
      const result = await service.getLikeStatus(2, 1);
      expect(result).toBe(true);
    });
  });

  describe('getAllUserCharacters', () => {
    it('should return user-created characters', async () => {
      mockFetchUserCreatedCharactersProvider.getAllUserCharacters.mockResolvedValueOnce(
        ['char'],
      );
      const result = await service.getAllUserCharacters(1, {
        limit: 10,
        page: 1,
      });
      expect(result).toEqual(['char']);
    });
  });

  describe('getLikedCharactersByUser', () => {
    it('should return liked characters', async () => {
      mockFetchUserLikedCharactersProvider.getLikedCharactersByUser.mockResolvedValueOnce(
        ['liked'],
      );
      const result = await service.getLikedCharactersByUser(1, {
        limit: 10,
        page: 1,
      });
      expect(result).toEqual(['liked']);
    });
  });

  describe('findOneByEmail', () => {
    it('should find by email', async () => {
      mockFindOneByEmailProvider.findOneByEmail.mockResolvedValueOnce({
        id: 1,
      });
      const result = await service.findOneByEmail('test@example.com');
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('findOneByGoogleId', () => {
    it('should find by Google ID', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce({ id: 1 });
      const result = await service.findOneByGoogleId('google-id');
      expect(result).toEqual({ id: 1 });
    });
  });
});
