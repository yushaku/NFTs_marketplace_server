import { JOB_LIST, QUEUE_LIST } from '@/shared/constant'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Logger } from '@nestjs/common'
import { sleep } from '@/shared/utils'

@Processor(QUEUE_LIST.CONTRACT)
export class ContractConsumer extends WorkerHost {
  logger = new Logger(ContractConsumer.name)

  constructor() {
    super()
  }

  async process(job: Job<any, any, string>) {
    try {
      switch (job.name) {
        case JOB_LIST.ORDER_PAID: {
          console.log({
            job: job.data,
          })
          sleep(1000)

          break
        }
      }
    } catch (e) {
      this.logger.error(`Scanner job error:`)
      this.logger.error(e)
    }
  }
}
