import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,
  awsBucketName: process.env.AWS_BUCKET_NAME,
  awsRegion: process.env.AWS_REGION,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsAccessId: process.env.AWS_ACCESS_KEY_ID,
}));
