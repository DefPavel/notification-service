import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { NotificationDto } from './dto/notification.dto';
import { NotificationsService } from './notification.service';

@Controller()
export class NotificationsProcessor {
  constructor(private readonly notificationService: NotificationsService) {}

  @MessagePattern('notification-topic')
  async processNotification(@Payload() data: NotificationDto) {
    const { email, message: content } = data;
    await this.notificationService.sendEmailWithRetry(email, content);
    return { status: 'success' };
  }
}
