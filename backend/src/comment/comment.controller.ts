import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { PublicRoute } from '../utils/public-route.decorator';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @PublicRoute()
  @Get()
  list() {
    return this.commentService.list();
  }

  @Post()
  create(@Body('comment') comment: string, @Req() req: any) {
    return this.commentService.create(comment, req.user.username);
  }
}
