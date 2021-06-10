import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  if (process.env.NODE_ENV === 'development') {
    const swaggerOption = new DocumentBuilder()
      .setTitle('CUPLES API Documentation')
      .setDescription('API Documention')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const swaggerDoc = SwaggerModule.createDocument(app, swaggerOption);
    SwaggerModule.setup('docs', app, swaggerDoc);
  }
  await app.listen(3000);
}
bootstrap();
