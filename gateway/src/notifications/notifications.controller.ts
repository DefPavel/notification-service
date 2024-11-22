import { Controller, Post, Body, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { CONNECTED_TOKENS } from '../common/constant';
import { NotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationsController implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(CONNECTED_TOKENS.KafkaConnect)
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  @Post('send')
  async sendNotification(@Body() data: NotificationDto): Promise<{ status: string }> {
    const response = await this.kafkaClient
      .emit('notification-topic', { value: JSON.stringify(data) })
      .toPromise();
    console.log(response);

    return { status: 'Notification queued' };
  }
}
