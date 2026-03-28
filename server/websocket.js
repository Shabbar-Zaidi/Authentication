import { WebSocketServer } from "ws";
import http from "http";
import express from "express";
import url from "url";

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

// Store online users → { userId: ws }
const userSocketMap = new Map();

// Get receiver's WebSocket connection
export function getReceiverSocket(userId) {
  return userSocketMap.get(userId);
}

// Broadcast helper
function broadcastOnlineUsers() {
  const onlineUsers = Array.from(userSocketMap.keys());
  const message = JSON.stringify({ type: "getOnlineUsers", users: onlineUsers });

  for (const ws of userSocketMap.values()) {
    if (ws.readyState === ws.OPEN) {
      ws.send(message);
    }
  }
}

// Handle new WebSocket connections
wss.on("connection", (ws, req) => {
  const query = url.parse(req.url, true).query;
  const userId = query.userId;

  if (userId) {
    userSocketMap.set(userId, ws);
    console.log(`✅ User connected: ${userId}`);
  }

  // Send current online users to all
  broadcastOnlineUsers();

  ws.on("close", () => {
    if (userId) {
      userSocketMap.delete(userId);
      console.log(`❌ User disconnected: ${userId}`);
      broadcastOnlineUsers();
    }
  });

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      // Example: Forward message to receiver
      if (data.type === "sendMessage" && data.receiverId) {
        const receiverSocket = getReceiverSocket(data.receiverId);
        if (receiverSocket && receiverSocket.readyState === ws.OPEN) {
          receiverSocket.send(
            JSON.stringify({
              type: "receiveMessage",
              from: userId,
              text: data.text,
            })
          );
        }
      }
    } catch (err) {
      console.error("Message parse error:", err);
    }
  });
});

export { app, server, wss };
