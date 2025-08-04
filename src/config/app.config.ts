import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,

  jwtSecret: process.env.JWT_SECRET,

  awsBucketName: process.env.AWS_BUCKET_NAME,
  awsRegion: process.env.AWS_REGION,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsAccessId: process.env.AWS_ACCESS_KEY_ID,

  mailHost: process.env.MAIL_HOST,
  mailPort: process.env.MAIL_PORT,
  smtpUserName: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,

  resendHost: process.env.RESEND_HOST,
  resendPort: process.env.RESEND_PORT,
  resendUser: process.env.RESEND_USER,
  resendPassword: process.env.RESEND_PASSWORD,
  resendAPI: process.env.RESEND_API_KEY,

  openAIKey: process.env.OPENAI_API_KEY,

  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhook: process.env.STRIPE_WEBHOOK_SECRET,

  paymentSuccessUrl: process.env.PAYMENT_SUCCESS_URL,
  paymentCancelUrl: process.env.PAYMENT_CANCEL_URL,

  basicPrice: process.env.BASIC_PRICE,
  premiumPrice: process.env.PREMIUM_PRICE,
}));
