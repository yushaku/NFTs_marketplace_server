import { JOB_LIST, QUEUE_LIST } from '@/shared/constant'
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq'
import { Job, Queue } from 'bullmq'
import { Logger } from '@nestjs/common'
import { sleep } from '@/shared/utils'
import { PrismaService } from '@/prisma.service'
import { OrderStatus } from '@prisma/client'

type PayedOrder = {
  topic: string
  data: {
    orderId: string
    buyer: string
    price: string
  }
}

@Processor(QUEUE_LIST.CONTRACT)
export class ContractConsumer extends WorkerHost {
  logger = new Logger(ContractConsumer.name)

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(QUEUE_LIST.CONTRACT) private queue: Queue,
  ) {
    super()
  }

  async process(job: Job<any, any, string>) {
    const { data } = job.data as PayedOrder

    try {
      switch (job.name) {
        case JOB_LIST.ORDER_PAID: {
          await this.prisma.order.update({
            where: { order_id: data.orderId },
            data: {
              status: OrderStatus.processing,
            },
          })
          break
        }
      }
    } catch (e) {
      this.logger.error(`Scanner job error:`)
      this.logger.error(e)
    }
  }
}
