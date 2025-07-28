import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appCreate } from './app.create';
import { TransformInterceptor } from './common/interceptors/transform.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appCreate(app);

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
