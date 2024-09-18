import { AppModule } from '@/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test, TestingModule } from '@nestjs/testing'

let app: INestApplication

export const initApp = async (modules = []) => {
  if (!app) {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ...modules],
    }).compile()

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter({ logger: false }))

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    )

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  }

  return app
}

export const closeApp = () => {
  app.close()
}
