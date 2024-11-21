import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { KafkaConfigProvider } from './config/kafka.config';
import { NotificationsController } from './notifications/notifications.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [KafkaConfigProvider],
  controllers: [NotificationsController],
})
export class AppModule {}
