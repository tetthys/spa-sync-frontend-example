// src/App.jsx
// Glue layer that integrates:
//   - socket (spa.js)
//   - useSpaRouteChannel (listen "spa:route")
//   - useSpaRouter (interpret DSL -> navigation + View + props)
//   - useSpaPropPipe (extract payload / flashes / meta)
//   - React Router (URL sync)

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { socket } from "./spa.js";
import { useSpaRouteChannel } from "@tetthys/use-spa-route-channel";
import { useSpaRouter } from "@tetthys/use-spa-router";
import { useSpaPropPipe } from "@tetthys/use-spa-prop-pipe";

import { SignInView } from "./views/SignInView.jsx";
import { PostsView } from "./views/PostsView.jsx";

/**
 * SpaShell
 *
 * Responsibilities:
 *  - Subscribe to "spa:route" via useSpaRouteChannel(socket).
 *  - Interpret DSL via useSpaRouter({ dsl, routes, views }).
 *  - Extract payload/flashes/meta via useSpaPropPipe({ dsl }).
 *  - Render appropriate view component.
 */
function SpaShell() {
  const dsl = useSpaRouteChannel({ socket });

  const { payload, flashes, meta } = useSpaPropPipe({ dsl });

  const routes = {
    // routeKey => URL
    "posts.index": "/posts",
  };

  const views = {
    // viewKey => React component
    "posts.index": PostsView,
  };

  const { View, viewProps } = useSpaRouter({ dsl, routes, views });

  // Before any DSL arrives, just show SignInView with latest flashes (if any).
  if (!View) {
    return <SignInView flashes={flashes} />;
  }

  // When DSL selects a view, render it with:
  // - merged viewProps (from payload + view.props)
  // - flashes + meta from useSpaPropPipe
  return <View {...viewProps} flashes={flashes} meta={meta} />;
}

/**
 * App
 *
 * Wraps SpaShell with BrowserRouter and maps URLs.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SpaShell />} />
        <Route path="/posts" element={<SpaShell />} />
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
