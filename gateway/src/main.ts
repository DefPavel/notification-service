import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CONNECTED_TOKENS } from './common/constant';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const kafkaConfig = app.get(CONNECTED_TOKENS.KafkaConnect);

  logger.log('Starting gateway...');
  app.connectMicroservice(kafkaConfig);

  const port = configService.get<number>('GATEWAY_PORT', 3000);
  app.setGlobalPrefix('api/v1');

  await app.startAllMicroservices();
  await app.listen(port);

  logger.log(`Application is running on http://localhost:${port}`);
}
bootstrap();
