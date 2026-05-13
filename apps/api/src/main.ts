import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as classTransformer from 'class-transformer';
import * as classValidator from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // In this workspace, Nest may resolve optional validator packages from the root
      // node_modules instead of apps/api, so we pass them explicitly.
      validatorPackage: classValidator,
      transformerPackage: classTransformer
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('GreenProof API')
    .setDescription('APIs for GreenProof community submissions, verification, and impact certificates.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('API_PORT') || 4000;
  await app.listen(port);
  console.log(`GreenProof API running on http://0.0.0.0:${port}`);
  console.log(`Swagger docs available at http://0.0.0.0:${port}/docs`);
}

bootstrap();
