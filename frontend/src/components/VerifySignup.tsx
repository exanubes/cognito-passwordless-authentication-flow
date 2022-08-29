import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LogIn } from "./LogIn";

export function VerifySignup() {
  const [status, setStatus] = useState("loading");
  const location = useLocation();
  useEffect(() => {
    const { code, username } = Object.fromEntries(
      new URLSearchParams(location.search)
    );
    if (!code || !username) {
      setStatus("missing_data");
      return;
    }
    fetch("http://localhost:3000/auth/signup/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        code,
      }),
    })
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);
  if (status === "loading") {
    return <p>Verifying account...</p>;
  }
  if (status === "success") {
    return (
      <>
        <p>Account verified</p>
        <LogIn />
      </>
    );
  }
  if (status === "missing_data") {
    return <p>Make sure code and username are provided</p>;
  }
  return <p>Could not verify account</p>;
}
