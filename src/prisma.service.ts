import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: process.env.IS_SHOW_DB_LOG === 'true' ? ['query', 'error'] : [],
    })
  }

  async onModuleInit() {
    await this.$connect()
  }
}
