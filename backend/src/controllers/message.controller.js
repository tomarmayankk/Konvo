import Conversation from "../models/Conversation.js";
import { io, getReceiverSocketId } from "../socket/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";


// GET SIDEBAR USERS
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(
      "Get Users Error:",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// GET MESSAGES
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;

    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: senderId,
        },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(
      "Get Messages Error:",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    const { id: receiverId } = req.params;

    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
    });

    if (newMessage) {
      await newMessage.save();
    }

    // SOCKET.IO

    const receiverSocketId =
      getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "newMessage",
        newMessage
      );
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(
      "Send Message Error:",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};