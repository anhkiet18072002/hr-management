import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { PrismaClientExceptionFilter } from 'src/common/exception-filter/prisma.exception-filter'

const bootstrap = async () => {
   const app = await NestFactory.create(AppModule)

   app.enableCors({
      origin: '*'
   })

   // Add global validation
   app.useGlobalPipes(new ValidationPipe())

   // Add global exception filters
   app.useGlobalFilters(new PrismaClientExceptionFilter(app.getHttpAdapter()))

   // Add Swgger
   const swaggerDocs = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
         .setTitle(`NexleHR API v${process.env.VERSION ?? '1.0.0'}`)
         .setDescription('The NexleHR API description')
         .setVersion(process.env.VERSION ?? '1.0.0')
         .addBearerAuth()
         .build()
   )

   SwaggerModule.setup('docs', app, swaggerDocs, {
      swaggerOptions: {
         persistAuthorization: true
      }
   })

   await app.listen(process.env.PORT ?? 3001)
}
bootstrap()
