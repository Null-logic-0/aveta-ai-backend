import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SignUpProvider } from './providers/sign-up.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { SignOutProvider } from './providers/sign-out.provider';
import { UpdatePassword } from './providers/update-password.provider';
import { ForgotPasswordProvider } from './providers/forgot-password.provider';
import { ResetPasswordProvider } from './providers/reset-password.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { GoogleUser } from './interface/google-user.interface';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockSignUpProvider = {
    signup: jest.fn(),
  };

  const mockSignInProvider = {
    singIn: jest.fn(),
  };

  const mockSignOutProvider = {
    signOut: jest.fn(),
  };

  const mockUpdatePassword = {
    updatePassword: jest.fn(),
  };

  const mockForgotPasswordProvider = {
    forgotPassword: jest.fn(),
  };

  const mockResetPasswordProvider = {
    resetPassword: jest.fn(),
  };

  const mockCreateGoogleUserProvider = {
    createGoogleUser: jest.fn(),
  };

  const mockRefreshTokensProvider = {
    refreshTokens: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: SignUpProvider, useValue: mockSignUpProvider },
        { provide: SignInProvider, useValue: mockSignInProvider },
        { provide: SignOutProvider, useValue: mockSignOutProvider },
        { provide: UpdatePassword, useValue: mockUpdatePassword },
        {
          provide: ForgotPasswordProvider,
          useValue: mockForgotPasswordProvider,
        },
        { provide: ResetPasswordProvider, useValue: mockResetPasswordProvider },
        {
          provide: CreateGoogleUserProvider,
          useValue: mockCreateGoogleUserProvider,
        },
        { provide: RefreshTokensProvider, useValue: mockRefreshTokensProvider },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should call signUpProvider.signup', async () => {
      const dto: SignUpDto = {
        email: 'test@example.com',
        userName: 'john Doe',
        password: 'Pass1234$',
        passwordConfirm: 'Pass1234$',
      };
      const expected = { id: 1 };
      mockSignUpProvider.signup.mockResolvedValue(expected);

      const result = await service.signUp(dto);
      expect(mockSignUpProvider.signup).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('signIn', () => {
    it('should call signInProvider.singIn', async () => {
      const dto: SignInDto = { email: 'test@example.com', password: 'pass' };
      const expected = { accessToken: 'token' };
      mockSignInProvider.singIn.mockResolvedValue(expected);

      const result = await service.signIn(dto);
      expect(mockSignInProvider.singIn).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('createGoogleUser', () => {
    it('should call createGoogleUserProvider.createGoogleUser', async () => {
      const googleUser: GoogleUser = {
        email: 'test@example.com',
        googleId: '12345',
        profileImage: 'avatar.png',
        userName: 'John Doe',
      };
      const expected = { id: 1 };
      mockCreateGoogleUserProvider.createGoogleUser.mockResolvedValue(expected);

      const result = await service.createGoogleUser(googleUser);
      expect(
        mockCreateGoogleUserProvider.createGoogleUser,
      ).toHaveBeenCalledWith(googleUser);
      expect(result).toEqual(expected);
    });
  });

  describe('signOut', () => {
    it('should call signOutProvider.signOut', async () => {
      const expected = { success: true };
      mockSignOutProvider.signOut.mockResolvedValue(expected);

      const result = await service.signOut(1);
      expect(mockSignOutProvider.signOut).toHaveBeenCalledWith(1);
      expect(result).toEqual(expected);
    });
  });

  describe('updatePassword', () => {
    it('should call updatePasswordProvider.updatePassword', async () => {
      const dto: UpdatePasswordDto = {
        currentPassword: 'Test1234$',
        newPassword: 'Pass1234$',
        confirmPassword: 'Pass1234$',
      };
      const expected = { updated: true };
      mockUpdatePassword.updatePassword.mockResolvedValue(expected);

      const result = await service.updatePassword(1, dto);
      expect(mockUpdatePassword.updatePassword).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(expected);
    });
  });

  describe('forgotPassword', () => {
    it('should call forgotPasswordProvider.forgotPassword', async () => {
      const dto: ForgotPasswordDto = { email: 'test@example.com' };
      const expected = { sent: true };
      mockForgotPasswordProvider.forgotPassword.mockResolvedValue(expected);

      const result = await service.forgotPassword(dto);
      expect(mockForgotPasswordProvider.forgotPassword).toHaveBeenCalledWith(
        dto,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('resetPassword', () => {
    it('should call resetPasswordProvider.resetPassword', async () => {
      const dto: ResetPasswordDto = {
        newPassword: 'Pass1234$',
        confirmPassword: 'Pass1234$',
      };
      const token = 'reset-token';
      const expected = { success: true };
      mockResetPasswordProvider.resetPassword.mockResolvedValue(expected);

      const result = await service.resetPassword(dto, token);
      expect(mockResetPasswordProvider.resetPassword).toHaveBeenCalledWith(
        dto,
        token,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('refreshTokens', () => {
    it('should call refreshTokenProvider.refreshTokens', async () => {
      const dto: RefreshTokenDto = { refreshToken: 'abc123' };
      const expected = { accessToken: 'new-token' };
      mockRefreshTokensProvider.refreshTokens.mockResolvedValue(expected);

      const result = await service.refreshTokens(dto);
      expect(mockRefreshTokensProvider.refreshTokens).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });
});
