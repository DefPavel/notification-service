import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';

import { AppModule } from './app.module';
import { CONNECTED_TOKENS } from './common/constant';
import { CustomValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const kafkaConfig = app.get(CONNECTED_TOKENS.KafkaConnect);
  const port = configService.get<number>('GATEWAY_PORT', 3000);

  app.use(compression());
  app.enableCors({
    origin: [`http://localhost:${port}`],
    methods: ['POST'],
    credentials: true,
  });
  app.useGlobalPipes(new CustomValidationPipe());

  app.setGlobalPrefix('api/v1');
  app.connectMicroservice(kafkaConfig);

  await app.startAllMicroservices();
  await app.listen(port);

  logger.log(`Gateway is running on http://localhost:${port}  ✅`);
}
bootstrap();
