import { Link } from "react-router-dom";
import React from "react";

export function Navigation() {
  return (
    <nav className="p-8 flex gap-4 text-4xl uppercase">
      <Link className="px-4 hover:underline hover:text-[#1565c0]" to="/login">
        Login
      </Link>
      <Link
        className="px-4 hover:underline hover:text-[#1565c0]"
        to="/register"
      >
        Register
      </Link>
      <Link
        className="px-4 hover:underline hover:text-[#1565c0]"
        to="/add-comment"
      >
        Add Comment
      </Link>
    </nav>
  );
}
