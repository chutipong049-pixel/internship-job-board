import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// ประกาศให้ TypeScript รู้จัก process เพื่อป้องกันขีดแดง
declare const process: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ตั้งค่า CORS อนุญาตให้ frontend ยิง API เข้ามาได้
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  // ตั้งค่า Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 NestJS Backend server is running on port: ${port}`);
}
bootstrap();