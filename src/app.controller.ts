import { Controller, Get } from '@nestjs/common'

import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus'
import { PrismaService } from './prisma.service'

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Welcome API' })
  getHello() {
    return { message: 'Welcome to API' }
  }

  @Get('/healthz')
  @ApiOperation({
    summary:
      'A health check is positive if all the assigned health indicators are up and running.',
  })
  healthCheck() {
    return this.health.check([() => this.db.pingCheck('database', this.prisma)])
  }
}
