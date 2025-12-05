// src/views/SignInView.jsx
// Simple stub sign-in form.
// Uses spaClient.dispatch() to trigger "auth.signIn" action.

import React, { useState } from "react";
import { spaClient } from "../spa.js";

/**
 * Props:
 *  - flashes?: object (e.g. { error, info })
 */
export function SignInView({ flashes = {} }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    spaClient.dispatch(
      "auth.signIn",
      { email, password },
      { requestId: Date.now().toString() }
    );
  }

  const globalError = flashes.error || null;
  const infoMessage = flashes.info || null;

  return (
    <div
      style={{ maxWidth: 360, margin: "40px auto", fontFamily: "sans-serif" }}
    >
      <h1>Sign In</h1>

      {globalError && (
        <div style={{ marginBottom: 8, color: "red" }}>
          {String(globalError)}
        </div>
      )}

      {infoMessage && (
        <div style={{ marginBottom: 8, color: "green" }}>
          {String(infoMessage)}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Email</label>
          <input
            style={{ width: "100%", padding: 4 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Password</label>
          <input
            type="password"
            style={{ width: "100%", padding: 4 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="any password"
          />
        </div>

        <button type="submit" style={{ width: "100%", padding: 8 }}>
          Sign In
        </button>
      </form>
    </div>
  );
}
