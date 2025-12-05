// src/spa.js
// Socket.IO + SpaSyncClient wiring.

import { io } from "socket.io-client";
import { createSpaSyncClient } from "@tetthys/spa-sync-client";

// Create low-level socket connection to backend.
export const socket = io("http://localhost:3001", {
  transports: ["websocket"],
});

// Create SpaSyncClient instance bound to this socket.
export const spaClient = createSpaSyncClient({
  socket,

  // Optional logging / error hooks
  onError: (errOrPacket) => {
    // eslint-disable-next-line no-console
    console.error("[spa-client error]", errOrPacket);
  },
  onLog: (info) => {
    // eslint-disable-next-line no-console
    console.log("[spa-client log]", info);
  },
});
