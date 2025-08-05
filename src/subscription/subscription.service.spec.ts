import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UserPlan } from './enums/userPlan.enum';
import { Repository } from 'typeorm';
import { Role } from '../auth/enums/role.enum';

// Provide a complete mock user based on the full User entity
const mockUser: User = {
  id: 42,
  userName: 'test_user',
  email: 'test@example.com',
  password: 'hashed-password',
  role: Role.User,
  UserPlan: UserPlan.Free,
  isPaid: false,
  messagesSentToday: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastMessageSentAt: new Date(),
  blogs: [],
  characters: [],
  chats: [],
  likedCharacters: [],
  isBlocked: false,
  tokenVersion: 0,
};

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
});

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let configService: ConfigService;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockStripe = {
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const values = {
                'appConfig.stripeSecretKey': 'sk_test_123',
                'appConfig.basicPrice': 'price_basic',
                'appConfig.premiumPrice': 'price_premium',
                'appConfig.paymentSuccessUrl': 'https://example.com/success',
                'appConfig.paymentCancelUrl': 'https://example.com/cancel',
                'appConfig.stripeWebhook': 'whsec_test',
              };
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return values[key];
            }),
          },
        },
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    userRepository = module.get(getRepositoryToken(User));
    service = new SubscriptionService(configService, userRepository);

    // Inject mock Stripe instance
    (service as any).stripe = mockStripe;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCheckoutSession', () => {
    it('should create a checkout session for basic plan', async () => {
      const fakeSession = { id: 'sess_123' };
      mockStripe.checkout.sessions.create.mockResolvedValue(fakeSession as any);

      const result = await service.createCheckoutSession(1, UserPlan.BASIC);
      expect(result).toEqual(fakeSession);
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'subscription',
          line_items: [{ price: 'price_basic', quantity: 1 }],
          metadata: { userId: '1', plan: UserPlan.BASIC },
        }),
      );
    });

    it('should throw BadRequestException on Stripe error', async () => {
      mockStripe.checkout.sessions.create.mockRejectedValue(
        new BadRequestException('Stripe error'),
      );

      await expect(
        service.createCheckoutSession(1, UserPlan.BASIC),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('constructEvent', () => {
    it('should construct a Stripe event', () => {
      const buffer = Buffer.from('raw body');
      const signature = 'test_sig';
      const fakeEvent = { id: 'evt_123' };

      mockStripe.webhooks.constructEvent.mockReturnValue(fakeEvent as any);

      const result = service.constructEvent(buffer, signature);
      expect(result).toEqual(fakeEvent);
      expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
        buffer,
        signature,
        'whsec_test',
      );
    });

    it('should throw if webhook secret is not defined', () => {
      jest
        .spyOn(configService, 'get')
        .mockImplementation((key) =>
          key === 'appConfig.stripeWebhook' ? undefined : 'value',
        );

      expect(() => service.constructEvent(Buffer.from(''), '')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('handleCheckoutCompleted', () => {
    it('should update user plan on success', async () => {
      const session = {
        metadata: {
          userId: 42,
          plan: UserPlan.PREMIUM,
        },
      } as any;

      userRepository.findOneBy.mockResolvedValue(mockUser);
      await service.handleCheckoutCompleted(session);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        UserPlan: UserPlan.PREMIUM,
        isPaid: true,
      });
    });

    it('should throw if metadata is missing', async () => {
      await expect(service.handleCheckoutCompleted({} as any)).rejects.toThrow(
        'Session metadata is missing',
      );
    });

    it('should throw BadRequestException on user update error', async () => {
      const session = {
        metadata: {
          userId: 1,
          plan: UserPlan.BASIC,
        },
      } as any;

      userRepository.findOneBy.mockRejectedValue(new Error('DB error'));

      await expect(service.handleCheckoutCompleted(session)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('constructor validation', () => {
    it('should throw NotFoundException if secret key is missing', () => {
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        if (key === 'appConfig.stripeSecretKey') return undefined;
        return 'dummy';
      });

      expect(
        () => new SubscriptionService(configService, userRepository),
      ).toThrow(NotFoundException);
    });
  });
});
