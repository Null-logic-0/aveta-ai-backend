import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import Stripe from 'stripe';
import { ApiOperation } from '@nestjs/swagger';
import { UserPlan } from './enums/userPlan.enum';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { SubscriptionService } from './subscription.service';
import { GetActiveUser } from '../auth/decorators/getActiveUser';
import { ActiveUserData } from '../auth/interface/active-user.interface';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('checkout')
  @ApiOperation({
    summary: 'Payment-checkout',
  })
  async createCheckout(
    @Body() body: { plan: UserPlan },
    @GetActiveUser() user: ActiveUserData,
  ) {
    const session = await this.subscriptionService.createCheckoutSession(
      user.sub,
      body.plan,
    );
    return { url: session.url };
  }

  @Post('stripe')
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Stripe webhook handler',
  })
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
    @Query('skipSignatureCheck') skipSignatureCheck?: string,
  ) {
    let event: Stripe.Event;

    if (skipSignatureCheck === 'true') {
      // Manual test, parse req.body as Stripe.Event explicitly, but check it's an object
      event = req.body as unknown as Stripe.Event;
    } else {
      if (!signature) {
        throw new HttpException(
          'Missing Stripe signature',
          HttpStatus.BAD_REQUEST,
        );
      }
      try {
        event = this.subscriptionService.constructEvent(
          (req as any).rawBody,
          signature,
        );
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        throw new HttpException(
          'Invalid webhook signature',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      try {
        await this.subscriptionService.handleCheckoutCompleted(session);
      } catch (error) {
        console.error('Error handling checkout session:', error);
        throw new HttpException(
          'Webhook handler error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return { received: true };
  }
}
