import { Comment, CommentType } from "./Comment";
import React from "react";

interface Props {
  comments: CommentType[];
}

export function CommentSection({ comments = [] }: Props) {
  return (
    <>
      <h3 className="text-left text-2xl font-semibold">Comment Section:</h3>
      <div className="border p-2 grid gap-4">
        {!comments.length && <p>No comments yet</p>}
        {comments?.map?.((comment) => (
          <Comment key={comment.id} author={comment.username}>
            {comment.value}
          </Comment>
        ))}
      </div>
    </>
  );
}
