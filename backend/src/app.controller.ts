import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicRoute } from './utils/public-route.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @PublicRoute()
  @Get()
  getHello(@Req() request: any): string {
    return this.appService.getHello();
  }
}
