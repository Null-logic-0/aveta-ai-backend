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
}));
