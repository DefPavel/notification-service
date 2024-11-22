import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

import { CONNECTED_TOKENS } from '../common/constant';

/**
 * Провайдер для подключения к Kafka.
 */
export const KafkaConfigProvider = {
  provide: CONNECTED_TOKENS.KafkaConnect,
  useFactory: (configService: ConfigService): KafkaOptions => {
    const brokers = configService.get<string>('KAFKA_BROKER', 'localhost:9092').split(',');
    const groupId = configService.get<string>('KAFKA_GROUP_ID', 'default-group');

    // console.log(brokers, groupId);

    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers,
          retry: {
            retries: 5, // Количество попыток переподключения
            initialRetryTime: 300, // Начальное время до первой попытки
            maxRetryTime: 30000, // Максимальное время попыток
          },
        },
        consumer: {
          groupId,
          heartbeatInterval: 5000, // Интервал отправки heartbeat сообщений
        },
        producer: {
          createPartitioner: Partitioners.LegacyPartitioner,
        },
      },
    };
  },
  inject: [ConfigService],
};
