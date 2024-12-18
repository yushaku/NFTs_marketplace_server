import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JWTService } from './jwt.service'
import { JwtStrategy } from './strategy'
import { ChainLinkService } from './ChainLink.service'
import { PaymentService } from './ShopPayment.service'

@Global()
@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRED_TIME') },
      }),
    }),
  ],
  providers: [JWTService, JwtStrategy, ChainLinkService, PaymentService],
  exports: [JWTService, ChainLinkService, PaymentService],
})
export class ShareModule {}
