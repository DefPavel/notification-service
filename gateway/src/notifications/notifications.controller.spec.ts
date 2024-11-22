import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../app.module';
import { CONNECTED_TOKENS } from '../common/constant';

describe('NotificationsController (e2e)', () => {
  let app: INestApplication;

  const kafkaClientMock = {
    emit: jest.fn(), // Мок метода emit
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CONNECTED_TOKENS.KafkaConnect)
      .useValue(kafkaClientMock) // Подменяем Kafka клиента на мок
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // проверка на отправку данных
  it('api/v1/notifications/send (POST) should return success response', async () => {
    const notificationData = {
      recipient: 'user@example.com',
      message: 'Hello, this is a test notification!',
    };

    const response = await request(app.getHttpServer())
      .post('/notifications/send')
      .send(notificationData)
      .expect(201);

    expect(kafkaClientMock.emit).toHaveBeenCalledWith('notification-topic', notificationData);
    expect(response.body).toEqual({ status: 'Notification queued' });
  });

  // проверка валидации данных при отправки
  it('api/v1/notifications/send (POST) should return validation error for missing fields', async () => {
    const invalidData = {}; // Отправляем пустой объект вместо корректных данных

    const response = await request(app.getHttpServer())
      .post('/notifications/send')
      .send(invalidData)
      .expect(400); // Ожидаем ошибку валидации

    // Проверяем, что ответ содержит ошибки
    expect(response.body.message).toBe('Validation failed');
  });
});
