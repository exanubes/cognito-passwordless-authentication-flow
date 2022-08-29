import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentService {
  private comments: Array<{ id: string; value: string; username?: string }> = [];

  create(comment: string, username: string) {
    const id = Date.now().toString();
    this.comments.push({ id, value: comment, username });
    return this.comments;
  }

  list() {
    return this.comments;
  }
}
