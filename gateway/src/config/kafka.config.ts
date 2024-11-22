import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

import { CONNECTED_TOKENS } from '../common/constant';

export const KafkaConfigProvider = {
  name: CONNECTED_TOKENS.KafkaConnect, // Указываем имя клиента
  provide: CONNECTED_TOKENS.KafkaConnect,
  useFactory: async (configService: ConfigService): Promise<KafkaOptions> => {
    const brokers = configService.get<string>('KAFKA_BROKER', 'localhost:9092').split(',');
    const groupId = configService.get<string>('KAFKA_GROUP_ID', 'default-group');

    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers,
          retry: {
            retries: 5,
            initialRetryTime: 300,
            maxRetryTime: 30000,
          },
        },
        consumer: {
          groupId,
          heartbeatInterval: 5000,
        },
        producer: {
          createPartitioner: Partitioners.LegacyPartitioner,
        },
      },
    };
  },
  inject: [ConfigService],
};
