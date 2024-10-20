import { SHOP_PAYMENT_ABI } from '@/abi/shopPayment'
import { PrismaService } from '@/prisma.service'
import { JOB_LIST, KEYS, QUEUE_LIST, RPC, TOPICS } from '@/shared/constant'
import { sleep } from '@/shared/utils'
import { InjectQueue } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Queue } from 'bullmq'
import { Interface, JsonRpcProvider } from 'ethers'
import { Command, CommandRunner } from 'nest-commander'

@Command({ name: 'scanner' })
export class ScannerService extends CommandRunner {
  logger = new Logger(ScannerService.name)

  BLOCK_RANGE = Number(process.env.BLOCK_RANGE || 5)
  contract = new Interface(SHOP_PAYMENT_ABI)
  invertedTopics = Object.fromEntries(
    Object.entries(TOPICS).map(([key, value]) => [value, key]),
  )

  info: (typeof RPC)['56' | '97']
  isDevMode = false
  provider: JsonRpcProvider

  constructor(
    @InjectQueue(QUEUE_LIST.CONTRACT) private queue: Queue,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    super()
    this.info = RPC[this.config.get('THE_CHAIN_ID') ?? 97]
    this.provider = new JsonRpcProvider(this.info.rpcUrls)
    this.isDevMode = this.config.get('NODE_ENV') === 'development'
  }

  async run(): Promise<void> {
    let fromBlock = await this.getCurrentBlock()
    let stone = fromBlock

    while (true) {
      const data = await this.provider.getLogs({
        fromBlock,
        toBlock: fromBlock + this.BLOCK_RANGE,
        address: [this.info.shopPayment],
        topics: [TOPICS.ORDER_PAID],
      })

      data.forEach(async (log) => {
        const topic = log.topics[0]
        const decodedLog = this.contract.parseLog(log)
        console.log(decodedLog.args)

        await this.queue.add(
          JOB_LIST.ORDER_PAID,
          {
            topic,
            data: {
              orderId: decodedLog.args[0],
              buyer: decodedLog.args[1],
              price: String(decodedLog.args[2]),
            },
          },
          {
            jobId: log.transactionHash,
            removeOnComplete: {
              age: 3600,
            },
          },
        )
      })

      if (data.length === 0) {
        const latestBlock = await this.getLatestBlock()
        fromBlock = latestBlock
          ? Math.min(latestBlock, fromBlock + this.BLOCK_RANGE)
          : fromBlock + this.BLOCK_RANGE
        await sleep(3_000)
      } else {
        const lastBlock = data.at(-1)?.blockNumber ?? fromBlock
        fromBlock = lastBlock + 1
      }

      if (fromBlock >= stone) {
        stone = fromBlock + this.BLOCK_RANGE
        await this.setCurrentBlock(fromBlock)
        this.logger.log(`Scan to block ${fromBlock}`)
      }
    }
  }

  async getLatestBlock() {
    try {
      const latestBlock = await this.provider.getBlock('latest')
      return latestBlock?.number
    } catch (error) {
      return null
    }
  }

  async getCurrentBlock() {
    const data = await this.prisma.config.findUnique({
      where: {
        key: KEYS.CURRENT_BLOCK,
      },
    })

    // return Number(data?.value ?? this.config.get('EVM_BLOCK'))
    return Number(this.config.get('EVM_BLOCK'))
  }

  async setCurrentBlock(value: string | number) {
    return this.prisma.config.upsert({
      where: {
        key: KEYS.CURRENT_BLOCK,
      },
      create: {
        key: KEYS.CURRENT_BLOCK,
        value: value.toString(),
      },
      update: {
        value: value.toString(),
      },
    })
  }
}
