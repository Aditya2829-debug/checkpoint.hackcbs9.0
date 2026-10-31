import { setDefaultResultOrder, setServers } from 'node:dns';

setDefaultResultOrder('ipv4first');
setServers(['1.1.1.1', '1.0.0.1']);

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api/v1');

  // Set Express body limit to 10mb for photo payloads
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  const corsOrigin = process.env.CORS_ORIGIN ?? '*';
  app.enableCors({
    origin:
      corsOrigin === '*'
        ? true
        : corsOrigin.split(',').map((origin) => origin.trim()),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new MongoExceptionFilter());
}
