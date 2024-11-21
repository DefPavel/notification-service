import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { CONNECTED_TOKENS } from './common/constant';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const kafkaConfig = app.get(CONNECTED_TOKENS.KafkaConnect);

  const port = configService.get<number>('GATEWAY_PORT', 3000);
  app.setGlobalPrefix('api/v1');
  app.connectMicroservice(kafkaConfig);

  await app.startAllMicroservices();
  await app.listen(port);

  logger.log(`Gateway is running on http://localhost:${port}  ✅`);
}
bootstrap();
