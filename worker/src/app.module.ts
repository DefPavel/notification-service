import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { KafkaConfigProvider } from './config/kafka.config';
import { NotificationsService } from './notifications/notification.service';
import { NotificationsProcessor } from './notifications/notifications.processor';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [NotificationsProcessor],
  providers: [KafkaConfigProvider, NotificationsService],
})
export class AppModule {}
