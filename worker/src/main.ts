import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const appContext = await NestFactory.createApplicationContext(AppModule);
  // Получение Kafka-конфигурации
  const kafkaConfig = appContext.get<MicroserviceOptions>('KAFKA_CONFIG');
  // Создание микросервиса с полученной конфигурацией
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    kafkaConfig,
  );
  // Включение обработки системных сигналов
  microservice.enableShutdownHooks();
  await microservice.listen();
  logger.log('Microservice is listening  ✅');
}
bootstrap();
