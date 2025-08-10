import * as express from 'express';
import { Response, Request, NextFunction } from 'express';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare module 'express' {
  interface Request {
    rawBody?: Buffer;
  }
}

export function appCreate(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');

    next();
  });

  app.use('/subscription/stripe', express.raw({ type: 'application/json' }));
  app.use(
    '/subscription/stripe',
    (req: Request, _res: Response, next: NextFunction) => {
      req.rawBody = req.body;
      next();
    },
  );

  app.use(express.json());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Aveta AI')
    .setDescription('Use The base Api URL as http://localhost:3000')
    .setLicense(
      'Apache License 2.0',
      'https://www.apache.org/licenses/LICENSE-2.0',
    )
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://chat.aveta.app',
      'https://aveta.app',
      'https://admin.aveta.app',
    ],
    credentials: true,
  });
}
