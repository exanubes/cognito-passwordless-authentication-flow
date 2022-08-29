import React, { PropsWithChildren, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { accessTokenKey, sessionTokenKey } from "../App";

export function VerifyLogin() {
  const [status, setStatus] = useState("loading");
  const location = useLocation();
  const { code, username } = Object.fromEntries(
    new URLSearchParams(location.search)
  );
  useEffect(() => {
    if (!code || !username) {
      setStatus("missing_data");
      return;
    }
    fetch("http://localhost:3000/auth/login/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        code,
        session: localStorage.getItem(sessionTokenKey),
      }),
    })
      .then((res) => res.json())
      .then((tokens) =>
        localStorage.setItem(accessTokenKey, tokens.AccessToken)
      )
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);
  if (status === "loading") {
    return <p>Verifying password...</p>;
  }
  if (status === "success") {
    return (
      <>
        <p>Signed in as {username}</p>
      </>
    );
  }
  if (status === "missing_data") {
    return <p>Make sure code and username are provided</p>;
  }
  return <p>Could not log in</p>;
}
