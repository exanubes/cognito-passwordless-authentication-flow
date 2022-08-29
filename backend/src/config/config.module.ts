import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { awsConfig } from './configs/aws.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [awsConfig],
    }),
  ],
})
export class ConfigModule {}
