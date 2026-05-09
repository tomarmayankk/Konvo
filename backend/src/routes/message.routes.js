import express from "express";

import protectRoute from "../middleware/auth.middleware.js";

import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.use(protectRoute);


// SIDEBAR USERS
router.get("/users", getUsersForSidebar);


// GET CHAT MESSAGES
router.get("/:id", getMessages);


// SEND MESSAGE
router.post("/send/:id", sendMessage);

export default router;