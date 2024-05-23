import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initTelemetry } from './telemetry/telemetry';

async function bootstrap() {
  initTelemetry();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}

bootstrap();
