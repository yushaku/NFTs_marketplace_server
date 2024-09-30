import { PrismaService } from '@/prisma.service'
import { Module } from '@nestjs/common'

import { ListenerService } from './listener.service'
import { ScannerService } from './scanner.service'
import { ContractConsumer } from './contract.consumer'
import { BullModule } from '@nestjs/bullmq'
import { QUEUE_LIST } from '@/shared/constant'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Joi from 'joi'

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        THE_CHAIN_ID: Joi.number().required().default(97),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
        },
        defaultJobOptions: {
          attempts: 3,
          removeOnComplete: true,
        },
      }),
    }),
    BullModule.registerQueue({ name: QUEUE_LIST.CONTRACT }),
  ],
  providers: [ListenerService, PrismaService, ScannerService, ContractConsumer],
  exports: [ListenerService, ScannerService, ContractConsumer],
})
export class ConsoleModule {}
