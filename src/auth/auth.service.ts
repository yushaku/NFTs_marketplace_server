import { PrismaService } from '@/prisma.service'
import { JWTService } from '@/shared/jwt.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { verifyMessage } from 'ethers'
import { LOGIN_MESSAGE } from '@/shared/constant'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JWTService,
  ) {}

  async login({ address, signedMessage }: UserDto) {
    const verified = await this.verifySignature(address, signedMessage)
    if (!verified) {
      throw new BadRequestException('Invalid signature')
    }

    let user = await this.prisma.user.findUnique({
      where: { wallet_address: address },
    })

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          wallet_address: address,
          name: 'Anonymous',
        },
      })
    }

    return this.jwt.createAccessToken({
      address,
      role: user.role,
    })
  }

  async verifySignature(
    address: string,
    signedMessage: string,
  ): Promise<boolean> {
    try {
      const recoveredAddress = verifyMessage(LOGIN_MESSAGE, signedMessage)
      return recoveredAddress.toLowerCase() === address.toLowerCase()
    } catch (error) {
      console.error('Signature verification failed:', error)
      return false
    }
  }
}
