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
    const groupId = configService.get<string>('KAFKA_WORKER_GROUP_ID', 'worker-group');

    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers,
        },
        consumer: {
          groupId,
        },
        producer: {
          createPartitioner: Partitioners.LegacyPartitioner,
        },
      },
    };
  },
  inject: [ConfigService],
};
