import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalGuards(new JwtGuard(new Reflector()));
  const port = 3000;
  await app.listen(port);
  console.log(`App running on http://localhost:${port}`);
}
bootstrap();
