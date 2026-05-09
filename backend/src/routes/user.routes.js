import express from "express";

import {
  searchUsers,
  addFriend,
  getFriends,
  getFriendRequests,
  rejectFriendRequest,
  acceptFriendRequest,
  sendFriendRequest,
} from "../controllers/user.controller.js";

import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/search",
  protectRoute,
  searchUsers
);

router.post(
  "/add-friend/:id",
  protectRoute,
  addFriend
);

router.get(
  "/friends",
  protectRoute,
  getFriends
);

router.post(
  "/send-request/:id",
  protectRoute,
  sendFriendRequest
);

router.post(
  "/accept-request/:id",
  protectRoute,
  acceptFriendRequest
);

router.post(
  "/reject-request/:id",
  protectRoute,
  rejectFriendRequest
);

router.get(
  "/friend-requests",
  protectRoute,
  getFriendRequests
);
export default router;