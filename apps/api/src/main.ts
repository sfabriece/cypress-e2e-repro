import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppConfiguration, appConfiguration } from '@api/config';

import { AppModule } from './app/app.module';

function configureSwagger(
  appConfig: AppConfiguration,
  app: INestApplication,
  globalPrefix: string
) {
  if (process.env['NODE_ENV'] === 'test') {
    return;
  }

  const swaggerDocumentOptions = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API Docs')
    .setVersion('1.0.0')
    .addServer(appConfig.domain, 'development')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerDocumentOptions
  );
  const swaggerUiPath = globalPrefix ? `/${globalPrefix}/docs` : '/docs';

  SwaggerModule.setup(swaggerUiPath, app, swaggerDocument);
  Logger.log(
    `Swagger Docs enabled: ${appConfig.domain}${swaggerUiPath}`,
    'NestApplication'
  );
}

declare const module: {
  hot: {
    accept: () => void;
    dispose: (value: unknown) => void;
  };
};

export async function configureApplication(
  app: INestApplication
): Promise<string> {
  const appConfig = app.get<AppConfiguration>(appConfiguration.KEY);

  const globalPrefix = '';
  app.setGlobalPrefix(globalPrefix);
  (app as NestExpressApplication).set('trust proxy', 1);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true
    })
  );

  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  app.enableShutdownHooks();

  configureSwagger(appConfig, app, globalPrefix);

  return globalPrefix;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get<AppConfiguration>(appConfiguration.KEY);

  const globalPrefix = await configureApplication(
    app as NestExpressApplication
  );

  await app.listen(appConfig.port);
  Logger.log(
    `🚀 Application is running on: ${appConfig.domain}/${globalPrefix}`
  );

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

if (process.env['NODE_ENV'] === 'ci') {
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap().catch((error) => Logger.error(error));
