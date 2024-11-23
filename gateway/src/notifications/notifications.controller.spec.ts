import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../app.module';
import { CONNECTED_TOKENS } from '../common/constant';
import { CustomValidationPipe } from '../common/pipes/validation.pipe';

describe('NotificationsController (e2e)', () => {
  let app: INestApplication;

  const kafkaClientMock = {
    emit: jest.fn(), // Мок метода emit
    connect: jest.fn(), // Мок метода connect
    close: jest.fn(), // Мок метода close
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CONNECTED_TOKENS.KafkaConnect)
      .useValue(kafkaClientMock) // Подменяем Kafka клиента на мок
      .compile();

    app = moduleFixture.createNestApplication();

    // Включаем ValidationPipe
    app.useGlobalPipes(new CustomValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // 1. Unit test - отправка письма
  it('api/v1/notifications/send (POST) - Отправка письма', async () => {
    const notificationData = {
      email: 'DefPavel14@yandex.ru',
      message: 'unit test message',
    };

    const response = await request(app.getHttpServer())
      .post('/notifications/send')
      .send(notificationData)
      .expect(201);

    // expect(kafkaClientMock.emit).toHaveBeenCalledWith('notification-topic', notificationData);
    expect(response.body).toEqual({ status: 'Notification queued' });
  });

  // 2. Unit test - Проверка валидации данных при отправке
  it('api/v1/notifications/send (POST) - Проверка валидации если данные не указаны', async () => {
    const invalidData = {};

    const response = await request(app.getHttpServer())
      .post('/notifications/send')
      .send(invalidData)
      .expect(400); // Ожидаем статус ошибки 400

    // Проверяем структуру и содержимое ответа
    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed',
      validationErrors: [
        {
          property: 'email',
          errors: [
            'email must be longer than or equal to 3 characters',
            'email should not be empty',
            'email must be an email',
          ],
        },
        {
          property: 'message',
          errors: [
            'message must be longer than or equal to 3 characters',
            'message should not be empty',
          ],
        },
      ],
    });
  });

  // 3. Unit test - Проверка валидации данных при отправке
  it('api/v1/notifications/send (POST) - Проверка валидации если некорректная почта', async () => {
    const invalidData = {
      email: 'test1488@384dkv',
      message: 'test',
    }; // Пустые данные, чтобы проверить ошибки валидации

    const response = await request(app.getHttpServer())
      .post('/notifications/send')
      .send(invalidData)
      .expect(400); // Ожидаем статус ошибки 400

    // Проверяем структуру и содержимое ответа
    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Validation failed',
      validationErrors: [
        {
          property: 'email',
          errors: ['email must be an email'],
        },
      ],
    });
  });
});
