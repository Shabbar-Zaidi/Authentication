import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", getUsersForSidebar);
messageRouter.get("/:id", verifyToken, getMessages);

messageRouter.post("/send/:id", verifyToken, sendMessage);

export default messageRouter;
