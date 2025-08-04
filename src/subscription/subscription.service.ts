import Stripe from 'stripe';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserPlan } from './enums/userPlan.enum';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const secretKey = this.configService.get<string>(
      'appConfig.stripeSecretKey',
    );

    if (!secretKey) {
      throw new Error(
        'Stripe secret key is not defined in environment variables',
      );
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: Stripe.API_VERSION as any,
    });
  }

  createCheckoutSession(userId: number, plan: UserPlan) {
    const priceId = {
      basic: this.configService.get<string>('appConfig.basicPrice'),
      premium: this.configService.get<string>('appConfig.premiumPrice'),
    }[plan];

    try {
      return this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { userId: userId.toString(), plan },
        success_url: this.configService.get<string>(
          'appConfig.paymentSuccessUrl',
        ),
        cancel_url: this.configService.get<string>(
          'appConfig.paymentCancelUrl',
        ),
        billing_address_collection: 'auto',
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Oops...something went wrong!',
      );
    }
  }

  getStripeInstance() {
    return this.stripe;
  }

  constructEvent(rawBody: Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.configService.get<string>(
      'appConfig.stripeWebhook',
    );

    if (!webhookSecret) {
      throw new NotFoundException(
        'STRIPE_WEBHOOK_SECRET is not defined in environment variables',
      );
    }

    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  }

  async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    if (!session.metadata) {
      throw new Error('Session metadata is missing');
    }

    const userId = parseInt(session.metadata.userId);
    const plan = session.metadata.plan;

    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (user) {
        user.UserPlan = plan === 'basic' ? UserPlan.BASIC : UserPlan.PREMIUM;
        user.isPaid = true;
        await this.userRepository.save(user);
      }
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Oops...something went wrong',
      );
    }
  }
}
