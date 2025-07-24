import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appCreate } from './app.create';
import { TransformInterceptor } from './common/interceptors/transform.interceptors';
import { AllExceptionsFilter } from './utils/all-exceptions-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appCreate(app);

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
