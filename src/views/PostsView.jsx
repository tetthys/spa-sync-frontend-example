// src/views/PostsView.jsx
// Posts index view with create / toggle / delete.
// Expects payload merged via useSpaRouter: { user, posts }.

import React, { useState } from "react";
import { spaClient } from "../spa.js";

/**
 * Props:
 *  - user?: { email, name }
 *  - posts?: Array<{ id, title, body, authorEmail }>
 *  - flashes?: object
 *  - meta?: object
 */
export function PostsView({
  user,
  posts = [],
  flashes = {},
  meta = {},
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const infoMessage = flashes.info || null;
  const errorMessage = flashes.error || null;

  function createPost(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    spaClient.dispatch(
      "post.create",
      { title, body },
      { requestId: Date.now().toString() }
    );

    setTitle("");
    setBody("");
  }

  function togglePost(id) {
    spaClient.dispatch(
      "post.update",
      { id }, // conceptual: server may interpret missing title/body as no change
      { requestId: Date.now().toString() }
    );
  }

  function deletePost(id) {
    spaClient.dispatch(
      "post.delete",
      { id },
      { requestId: Date.now().toString() }
    );
  }

  return (
    <div
      style={{ maxWidth: 640, margin: "40px auto", fontFamily: "sans-serif" }}
    >
      <h1>Posts</h1>

      {user && (
        <div style={{ marginBottom: 12, fontSize: 14 }}>
          Signed in as <strong>{user.email}</strong>
        </div>
      )}

      {infoMessage && (
        <div style={{ marginBottom: 8, color: "green" }}>
          {String(infoMessage)}
        </div>
      )}

      {errorMessage && (
        <div style={{ marginBottom: 8, color: "red" }}>
          {String(errorMessage)}
        </div>
      )}

      <form onSubmit={createPost} style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Title</label>
          <input
            style={{ width: "100%", padding: 4 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Body</label>
          <textarea
            style={{ width: "100%", padding: 4, minHeight: 80 }}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Post body"
          />
        </div>

        <button type="submit" style={{ padding: 8 }}>
          Create Post
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((p) => (
          <li
            key={p.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: 8,
              marginBottom: 8,
            }}
          >
            <div style={{ fontWeight: "bold" }}>{p.title}</div>
            <div style={{ margin: "4px 0" }}>{p.body}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              Author: {p.authorEmail}
            </div>
            <div style={{ marginTop: 8 }}>
              <button
                type="button"
                onClick={() => togglePost(p.id)}
                style={{ marginRight: 8 }}
              >
                Toggle (demo)
              </button>
              <button type="button" onClick={() => deletePost(p.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {posts.length === 0 && (
        <div style={{ fontSize: 14, color: "#666" }}>No posts yet.</div>
      )}

      <pre style={{ marginTop: 24, fontSize: 11, color: "#999" }}>
        meta: {JSON.stringify(meta, null, 2)}
      </pre>
    </div>
  );
}
