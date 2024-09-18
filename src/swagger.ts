import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

// Swagger API Document
export const swagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('APIs document')
    .addBearerAuth()
    .setVersion('0.1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('/docs', app, document)
}
