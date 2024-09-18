import { PrismaService } from '@/prisma.service'
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [PassportModule],
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
