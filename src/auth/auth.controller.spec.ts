/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { BadRequestException } from '@nestjs/common';
import { ActiveUserData } from './interface/active-user.interface';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    updatePassword: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    refreshTokens: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call authService.signUp with correct data', async () => {
      const dto: SignUpDto = {
        email: 'test@example.com',
        userName: 'John Doe',
        password: 'password123',
        passwordConfirm: 'password123',
      };

      mockAuthService.signUp.mockResolvedValue('mockedUser');

      const result = await controller.signUp(dto);
      expect(authService.signUp).toHaveBeenCalledWith(dto);
      expect(result).toBe('mockedUser');
    });
  });

  describe('signIn', () => {
    it('should call authService.signIn with correct data', async () => {
      const dto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.signIn.mockResolvedValue('mockedTokens');

      const result = await controller.signIn(dto);
      expect(authService.signIn).toHaveBeenCalledWith(dto);
      expect(result).toBe('mockedTokens');
    });
  });

  describe('signOut', () => {
    it('should call authService.signOut with user ID', async () => {
      const user = { sub: 123 } as ActiveUserData;

      mockAuthService.signOut.mockResolvedValue('logged out');

      const result = await controller.signOut(user);
      expect(authService.signOut).toHaveBeenCalledWith(123);
      expect(result).toBe('logged out');
    });
  });

  describe('updatePassword', () => {
    it('should call authService.updatePassword with user ID and dto', async () => {
      const user = { sub: 123 } as ActiveUserData;
      const dto: UpdatePasswordDto = {
        currentPassword: 'Pass1234$',
        newPassword: 'Test1234$',
        confirmPassword: 'Test1234$',
      };

      mockAuthService.updatePassword.mockResolvedValue('updated');

      const result = await controller.updatePassword(user, dto);
      expect(authService.updatePassword).toHaveBeenCalledWith(123, dto);
      expect(result).toBe('updated');
    });
  });

  describe('forgotPassword', () => {
    it('should call authService.forgotPassword with dto', async () => {
      const dto: ForgotPasswordDto = { email: 'test@example.com' };

      mockAuthService.forgotPassword.mockResolvedValue('email sent');

      const result = await controller.forgotPassword(dto);
      expect(authService.forgotPassword).toHaveBeenCalledWith(dto);
      expect(result).toBe('email sent');
    });
  });

  describe('resetPassword', () => {
    it('should throw if no Bearer token provided', async () => {
      const dto: ResetPasswordDto = {
        newPassword: 'Pass1234$',
        confirmPassword: 'Pass1234$',
      };

      await expect(controller.resetPassword(dto, '')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should call authService.resetPassword with dto and token', async () => {
      const dto: ResetPasswordDto = {
        newPassword: 'Pass1234$',
        confirmPassword: 'Pass1234$',
      };

      const authHeader = 'Bearer mockToken';

      mockAuthService.resetPassword.mockResolvedValue('reset');

      const result = await controller.resetPassword(dto, authHeader);
      expect(authService.resetPassword).toHaveBeenCalledWith(dto, 'mockToken');
      expect(result).toBe('reset');
    });
  });

  describe('refreshTokens', () => {
    it('should call authService.refreshTokens with dto', async () => {
      const dto: RefreshTokenDto = {
        refreshToken: 'token',
      };

      mockAuthService.refreshTokens.mockResolvedValue('newTokens');

      const result = await controller.refreshTokens(dto);
      expect(authService.refreshTokens).toHaveBeenCalledWith(dto);
      expect(result).toBe('newTokens');
    });
  });
});
