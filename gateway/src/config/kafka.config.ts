import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

import { CONNECTED_TOKENS } from '../common/constant';

/**
 * Провайдер для подключения к Kafka.
 */
export const KafkaConfigProvider = {
  provide: CONNECTED_TOKENS.KafkaConnect,
  useFactory: (configService: ConfigService): KafkaOptions => {
    const brokers = configService.get<string>('KAFKA_BROKER', 'localhost:9092').split(',');
    const groupId = configService.get<string>('KAFKA_GROUP_ID', 'default-group');

    console.log(brokers);

    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers,
          retry: {
            retries: 5, // Количество попыток переподключения
          },
        },
        consumer: {
          groupId,
          heartbeatInterval: 3000, // Интервал отправки heartbeat сообщений
        },
      },
    };
  },
  inject: [ConfigService],
};
