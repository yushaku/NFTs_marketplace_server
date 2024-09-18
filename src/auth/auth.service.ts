import { PrismaService } from '@/prisma.service'
import { JWTService } from '@/shared/jwt.service'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { UserDto } from './dto/user.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JWTService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async login({ email, password }: UserDto) {
    return {
      email,
      password,
    }
  }
}
