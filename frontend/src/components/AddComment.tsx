import React, { FormEvent } from "react";
import { accessTokenKey } from "../App";

interface Props {
  onSubmit: React.Dispatch<React.SetStateAction<any>>;
}

export function AddComment({ onSubmit }: Props) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as unknown as {
      elements: HTMLInputElement[];
      reset(): void;
    };

    const [textarea] = form.elements;
    const accessToken = localStorage.getItem(accessTokenKey);
    if (accessToken) {
      fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${accessToken}`,
        },
        body: JSON.stringify({ comment: textarea.value }),
      })
        .then((res) => res.json())
        .then(onSubmit);
      form.reset();
    } else {
      console.error("You are not logged in!");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <p className="text-left">write a comment</p>
      <textarea className="border w-full" />
      <button
        className="bg-[#1565c0aa] py-2 uppercase font-semibold text-white w-full hover:bg-[#1565c0bb]"
        type="submit"
      >
        Post Comment
      </button>
    </form>
  );
}
