import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { CONNECTED_TOKENS } from '../common/constant';
import { NotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject(CONNECTED_TOKENS.KafkaConnect)
    private readonly kafkaClient: ClientKafka,
  ) {}

  @Post('send')
  async sendNotification(@Body() data: NotificationDto): Promise<{
    status: string;
  }> {
    this.kafkaClient.emit('notification-topic', data);
    return { status: 'Notification queued' };
  }
}
