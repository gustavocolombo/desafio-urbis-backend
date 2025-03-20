import { ConsoleLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { swagger } from './config/swagger/Swagger';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
    }),
  });

  app.useWebSocketAdapter(new WsAdapter(app));

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH',
  });

  swagger.setup(app);

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
