import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';



async function server() {
  const PORT = process.env.PORT || 2023

  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe)

  await app.listen(PORT, () => {
    console.log(`\x1b[36m%s\x1b[0m`, `Server has been initialized on: http://localhost:${PORT} --> ${new Date()}`)
  })
}

server()
