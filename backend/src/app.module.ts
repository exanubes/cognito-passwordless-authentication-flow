import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [AuthModule, CommentModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
