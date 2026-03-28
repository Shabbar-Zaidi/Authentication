import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/authRoutes.js";
import cors from "cors";
import connectDB from "./lib/db.js";
import profileRouter from "./routes/profileRoute.js";
import passport from "passport";
import session from "express-session";
import "./lib/passport.js";
import { WebSocketServer } from "ws";
import http from "http";
import { server, app } from "./websocket.js";
import messageRouter from "./routes/messageRoute.js";

dotenv.config();
// const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
connectDB();
// Session setup (required for Passport)
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Facebook Login Route

// const server = http.createServer(app);
// // WebSocket
// initWebSocket(server);

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/messages", messageRouter);

server.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
