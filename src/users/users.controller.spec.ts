import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from '../auth/enums/role.enum';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UpdateUserProfileDto } from './dtos/update-user-profile.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserPlan } from '../subscription/enums/userPlan.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;

  const mockUser = {
    sub: 1,
    googleId: undefined,
    email: 'example@example.com',
    role: Role.User,
    userPlan: UserPlan.Free,
    tokenVersion: 1,
  };

  beforeEach(async () => {
    usersService = {
      getAll: jest.fn(),
      updateUserRole: jest.fn(),
      toggleBlockUser: jest.fn(),
      removeUser: jest.fn(),
      getOne: jest.fn(),
      findOneByGoogleId: jest.fn(),
      getAllUserCharacters: jest.fn(),
      getLikedCharactersByUser: jest.fn(),
      updateProfile: jest.fn(),
      toggleLike: jest.fn(),
      getLikeStatus: jest.fn(),
      deleteAccount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should get all users', async () => {
    usersService.getAll!.mockResolvedValue(['user1', 'user2']);
    expect(await controller.getAllUsers(mockUser)).toEqual(['user1', 'user2']);
  });

  it('should update user role', async () => {
    const dto: UpdateUserRoleDto = { role: Role.Creator };
    usersService.updateUserRole!.mockResolvedValue({
      id: 1,
      role: Role.Creator,
    });

    expect(await controller.updateUserRole(1, dto)).toEqual({
      id: 1,
      role: Role.Creator,
    });
  });

  it('should toggle user block status', async () => {
    usersService.toggleBlockUser!.mockResolvedValue({ blocked: true });

    expect(await controller.toggleBlockUser(1)).toEqual({ blocked: true });
  });

  it('should delete user', async () => {
    usersService.removeUser!.mockResolvedValue({ deleted: true });

    expect(await controller.deleteUser(1)).toEqual({ deleted: true });
  });

  it('should fetch current user profile', async () => {
    usersService.getOne!.mockResolvedValue({ id: 1 });
    expect(await controller.getCurrentUser(mockUser)).toEqual({ id: 1 });
  });

  it('should throw if user not found', async () => {
    usersService.getOne!.mockResolvedValue(null);
    await expect(controller.getCurrentUser(mockUser)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should fetch single user by id', async () => {
    usersService.getOne!.mockResolvedValue({ id: 2 });
    expect(await controller.getSingleUser(2)).toEqual({ id: 2 });
  });

  it('should fetch all characters by user', async () => {
    usersService.getAllUserCharacters!.mockResolvedValue(['char1', 'char2']);
    const query = { limit: 10, page: 1 };

    expect(await controller.getAllUserCharacters(mockUser, query)).toEqual([
      'char1',
      'char2',
    ]);
  });

  it('should throw if targetUserId is invalid', async () => {
    const query = { limit: 10, page: 1, targetUserId: 'abc' };
    await expect(
      controller.getAllUserCharacters(mockUser, query),
    ).rejects.toThrow(BadRequestException);
  });

  it('should fetch liked characters', async () => {
    usersService.getLikedCharactersByUser!.mockResolvedValue(['liked1']);
    const query = { limit: 10, page: 1 };

    expect(await controller.getLikedCharactersByUser(mockUser, query)).toEqual([
      'liked1',
    ]);
  });

  it('should update profile with image', async () => {
    const dto: UpdateUserProfileDto = { profileImage: 'Updated' };
    const file = { originalname: 'test.png' } as Express.Multer.File;

    usersService.updateProfile!.mockResolvedValue({ updated: true });

    expect(await controller.updateProfile(mockUser, dto, file)).toEqual({
      updated: true,
    });
  });

  it('should like/unlike character', async () => {
    usersService.toggleLike!.mockResolvedValue({ liked: true });

    expect(await controller.toggleLike(mockUser, 1)).toEqual({ liked: true });
  });

  it('should get like status of a character', async () => {
    usersService.getLikeStatus!.mockResolvedValue({ liked: true });

    expect(await controller.getLikeStatus(1, mockUser)).toEqual({
      liked: true,
    });
  });

  it('should delete user account', async () => {
    usersService.deleteAccount!.mockResolvedValue({ deleted: true });

    expect(await controller.deleteAccount(mockUser)).toEqual({ deleted: true });
  });
});
