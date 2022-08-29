import React, { FormEvent, useState } from "react";
import { sessionTokenKey } from "../App";

export function LogIn() {
  const [emailSent, setEmailSent] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as unknown as {
      elements: HTMLInputElement[];
      reset(): void;
    };

    const [username] = form.elements;
    fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
      }),
    })
      .then((res) => res.json())
      .then((tokens) => {
        localStorage.setItem(sessionTokenKey, tokens.Session);
        return tokens;
      })
      .then(console.log)
      .then(() => setEmailSent(true));
    form.reset();
  };
  return (
    <form onSubmit={handleSubmit} className="grid gap-4 grid-cols-1">
      {emailSent && <p>Sign in link was sent to your email address</p>}
      <label className="flex gap-4">
        <span className="w-[10rem] text-left">Username</span>
        <input className="border w-full py-1" placeholder="Johnny" />
      </label>
      <button
        className="bg-[#1565c0aa] py-2 uppercase font-semibold text-white hover:bg-[#1565c0bb]"
        type="submit"
      >
        Log In
      </button>
    </form>
  );
}
