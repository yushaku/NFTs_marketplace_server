import { PrismaService } from '@/prisma.service'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
