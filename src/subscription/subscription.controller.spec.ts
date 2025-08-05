import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { UserPlan } from './enums/userPlan.enum';
import Stripe from 'stripe';
import { Role } from '../auth/enums/role.enum';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;
  let mockSubscriptionService: Partial<
    Record<keyof SubscriptionService, jest.Mock>
  >;

  beforeEach(async () => {
    mockSubscriptionService = {
      createCheckoutSession: jest.fn(),
      constructEvent: jest.fn(),
      handleCheckoutCompleted: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        {
          provide: SubscriptionService,
          useValue: mockSubscriptionService,
        },
      ],
    }).compile();

    controller = module.get<SubscriptionController>(SubscriptionController);
  });

  describe('createCheckout', () => {
    it('should return a session URL', async () => {
      const mockUrl = 'https://example.com/checkout-session';
      mockSubscriptionService.createCheckoutSession!.mockResolvedValueOnce({
        url: mockUrl,
      });

      const result = await controller.createCheckout(
        { plan: UserPlan.PREMIUM },
        {
          sub: 1,
          googleId: null as any, // bypass strict typing in tests
          email: 'user@example.com',
          role: Role.User,
          userPlan: UserPlan.Free,
          tokenVersion: 0,
        },
      );

      expect(result).toEqual({ url: mockUrl });
      expect(
        mockSubscriptionService.createCheckoutSession,
      ).toHaveBeenCalledWith(1, UserPlan.PREMIUM);
    });
  });

  describe('handleStripeWebhook', () => {
    it('should handle a checkout.session.completed event', async () => {
      const mockSession = { id: 'cs_test' } as Stripe.Checkout.Session;
      const mockStripeEvent = {
        type: 'checkout.session.completed',
        data: { object: mockSession },
      } as Stripe.Event;

      mockSubscriptionService.constructEvent!.mockImplementation(
        () => mockStripeEvent,
      );
      mockSubscriptionService.handleCheckoutCompleted!.mockResolvedValueOnce(
        undefined,
      );

      const req = {
        body: {},
        rawBody: Buffer.from('mock-raw-body'),
      } as any;

      const signature = 'mock-signature';

      const result = await controller.handleStripeWebhook(req, signature);

      expect(mockSubscriptionService.constructEvent).toHaveBeenCalledWith(
        Buffer.from('mock-raw-body'),
        'mock-signature',
      );
      expect(
        mockSubscriptionService.handleCheckoutCompleted,
      ).toHaveBeenCalledWith(mockSession);
      expect(result).toEqual({ received: true });
    });

    it('should bypass signature check when skipSignatureCheck is true', async () => {
      const req = {
        body: {
          type: 'checkout.session.completed',
          data: { object: { id: 'manual-session' } },
        },
      } as any;

      mockSubscriptionService.handleCheckoutCompleted!.mockResolvedValueOnce(
        undefined,
      );

      const result = await controller.handleStripeWebhook(req, '', 'true');

      expect(
        mockSubscriptionService.handleCheckoutCompleted,
      ).toHaveBeenCalledWith({ id: 'manual-session' });
      expect(result).toEqual({ received: true });
    });
  });
});
