import React, { PropsWithChildren } from "react";

interface Props {
  author?: string;
}
export interface CommentType {
  id: string;
  value: string;
  username?: string;
}
export function Comment({ children, author }: PropsWithChildren<Props>) {
  return (
    <div className="flex gap-4 items-center">
      {author && (
        <p className="text-left text-sm ml-4 text-[#222222aa] font-semibold">
          {author}:
        </p>
      )}
      <p>{children}</p>
    </div>
  );
}
