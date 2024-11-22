import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

class EmailServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EmailServiceError';
  }
}

@Injectable()
export class NotificationsService {
  constructor() {}

  private readonly maxRetries = 3; // Максимальное количество попыток
  private readonly retryDelay = 3000; // Задержка между попытками (в миллисекундах)
  private readonly logger = new Logger(NotificationsService.name);

  private createTransporter(): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Для SSL соединений нужно указать secure: true
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private async sendEmailWithRetryLogic(
    transporter: nodemailer.Transporter,
    email: string,
    content: string,
  ): Promise<void> {
    let attempt = 0;
    while (attempt < this.maxRetries) {
      attempt++;
      try {
        await transporter.sendMail({
          to: email,
          subject: 'Notification',
          text: content,
        });
        return; // Если отправка успешна, выходим из функции
      } catch (error) {
        if (error instanceof Error) {
          this.logger.error(`Attempt ${attempt} failed: ${error?.message || error}`);
          if (attempt >= this.maxRetries) {
            throw new EmailServiceError(
              `Failed to send email after ${this.maxRetries} attempts: ${error.message}`,
            );
          }
        }
        await this.delay(this.retryDelay); // Ожидаем перед следующей попыткой
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async sendEmailWithRetry(email: string, content: string): Promise<void> {
    const transporter = this.createTransporter();

    try {
      await this.sendEmailWithRetryLogic(transporter, email, content);
      this.logger.log(`Email sent successfully to ${email}`);
    } catch (error) {
      if (error instanceof EmailServiceError) {
        this.logger.error(`Failed to send email to ${email}: ${error.message}`);
      } else {
        this.logger.error(`An unknown error occurred while sending email to ${email}`);
      }
      throw error; // Перекидываем ошибку наверх для дальнейшей обработки
    }
  }
}
