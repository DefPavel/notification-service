import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

import { KafkaConfigProvider } from './config/kafka.config';
import { NotificationsController } from './notifications/notifications.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([KafkaConfigProvider]),
  ],
  controllers: [NotificationsController],
})
export class AppModule {}
