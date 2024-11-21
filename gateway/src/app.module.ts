import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaConnection } from './configs/kafka.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [KafkaConnection],
})
export class AppModule {}
