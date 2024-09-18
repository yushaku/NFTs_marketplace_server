import { BullModule } from '@nestjs/bullmq'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-ioredis-yet'

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TerminusModule } from '@nestjs/terminus'
import { ThrottlerModule } from '@nestjs/throttler'
import { LoggerModule } from 'nestjs-pino'
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis'

import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma.service'
import { ShareModule } from './shared/share.module'
import { UserModule } from './user/user.module'

import Redis from 'ioredis'
import Joi from 'joi'

const { NODE_ENV = 'development' } = process.env
const isProd = NODE_ENV === 'production'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        REDIS_HOST: Joi.string().required().default('localhost'),
        REDIS_PORT: Joi.string().required().default(6379),

        JWT_SECRET: Joi.string().required(),
        COOKIE_SECRET: Joi.string().required(),

        THROTTLE_LIMIT: Joi.number().default(20),
        THROTTLE_TTL: Joi.number().default(60),
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
    LoggerModule.forRoot({
      pinoHttp: {
        level: isProd ? 'info' : 'debug',
        transport: {
          target: 'pino-pretty',
          options: { singleLine: true, ignore: 'pid,hostname' },
        },
        autoLogging: isProd ? false : false,
        quietReqLogger: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get('THROTTLE_TTL'),
            limit: config.get('THROTTLE_LIMIT'),
          },
        ],
        storage: new ThrottlerStorageRedisService(
          new Redis({
            port: config.get('REDIS_PORT'),
            host: config.get('REDIS_HOST'),
          }),
        ),
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: redisStore,
        redisInstance: new Redis({
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
        }),
      }),
    }),
    TerminusModule,
    UserModule,
    AuthModule,
    ShareModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
