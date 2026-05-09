import User from "../models/User.js";


// SEARCH USERS

export const searchUsers = async (
  req,
  res
) => {
  try {
    const query = req.query.q || "";

    const loggedInUserId = req.user._id;

    const users = await User.find({
      _id: {
        $ne: loggedInUserId,
      },

      fullName: {
        $regex: query,
        $options: "i",
      },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.log(
      "Search Users Error:",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// ADD FRIEND

export const addFriend = async (
  req,
  res
) => {
  try {
    const loggedInUserId = req.user._id;

    const { id: friendId } = req.params;

    if (
      loggedInUserId.toString() ===
      friendId
    ) {
      return res.status(400).json({
        message:
          "You cannot add yourself",
      });
    }

    const user = await User.findById(
      loggedInUserId
    );

    const friend = await User.findById(
      friendId
    );

    if (!friend) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ALREADY FRIENDS

    if (
      user.friends.includes(friendId)
    ) {
      return res.status(400).json({
        message: "Already friends",
      });
    }

    // ADD BOTH SIDES

    user.friends.push(friendId);

    friend.friends.push(loggedInUserId);

    await user.save();

    await friend.save();

    res.status(200).json({
      message: "Friend added",
    });
  } catch (error) {
    console.log(
      "Add Friend Error:",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// GET FRIENDS

export const getFriends = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    )
      .populate(
        "friends",
        "-password"
      );

    res.status(200).json(user.friends);
  } catch (error) {
    console.log(
      "Get Friends Error:",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const sendFriendRequest =
  async (req, res) => {
    try {
      const senderId = req.user._id;

      const { id: receiverId } =
        req.params;

      if (
        senderId.toString() ===
        receiverId
      ) {
        return res.status(400).json({
          message:
            "You cannot send request to yourself",
        });
      }

      const sender =
        await User.findById(senderId);

      const receiver =
        await User.findById(receiverId);

      if (!receiver) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // ALREADY FRIENDS

      if (
        sender.friends.includes(
          receiverId
        )
      ) {
        return res.status(400).json({
          message: "Already friends",
        });
      }

      // REQUEST ALREADY SENT

      if (
        sender.friendRequestsSent.includes(
          receiverId
        )
      ) {
        return res.status(400).json({
          message:
            "Request already sent",
        });
      }

      sender.friendRequestsSent.push(
        receiverId
      );

      receiver.friendRequestsReceived.push(
        senderId
      );

      await sender.save();

      await receiver.save();

      res.status(200).json({
        message:
          "Friend request sent",
      });
    } catch (error) {
      console.log(
        "Send Friend Request Error:",
        error.message
      );

      res.status(500).json({
        message:
          "Internal Server Error",
      });
    }
  };

  export const acceptFriendRequest =
  async (req, res) => {
    try {
      const receiverId = req.user._id;

      const { id: senderId } =
        req.params;

      const receiver =
        await User.findById(receiverId);

      const sender =
        await User.findById(senderId);

      if (
        !receiver.friendRequestsReceived.includes(
          senderId
        )
      ) {
        return res.status(400).json({
          message:
            "No friend request found",
        });
      }

      // REMOVE REQUESTS

      receiver.friendRequestsReceived =
        receiver.friendRequestsReceived.filter(
          (id) =>
            id.toString() !== senderId
        );

      sender.friendRequestsSent =
        sender.friendRequestsSent.filter(
          (id) =>
            id.toString() !==
            receiverId.toString()
        );

      // ADD FRIENDS

      receiver.friends.push(senderId);

      sender.friends.push(receiverId);

      await receiver.save();

      await sender.save();

      res.status(200).json({
        message:
          "Friend request accepted",
      });
    } catch (error) {
      console.log(
        "Accept Friend Request Error:",
        error.message
      );

      res.status(500).json({
        message:
          "Internal Server Error",
      });
    }
  };

  export const rejectFriendRequest =
  async (req, res) => {
    try {
      const receiverId = req.user._id;

      const { id: senderId } =
        req.params;

      const receiver =
        await User.findById(receiverId);

      const sender =
        await User.findById(senderId);

      receiver.friendRequestsReceived =
        receiver.friendRequestsReceived.filter(
          (id) =>
            id.toString() !== senderId
        );

      sender.friendRequestsSent =
        sender.friendRequestsSent.filter(
          (id) =>
            id.toString() !==
            receiverId.toString()
        );

      await receiver.save();

      await sender.save();

      res.status(200).json({
        message:
          "Friend request rejected",
      });
    } catch (error) {
      console.log(
        "Reject Friend Request Error:",
        error.message
      );

      res.status(500).json({
        message:
          "Internal Server Error",
      });
    }
  };

  export const getFriendRequests =
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user._id
      ).populate(
        "friendRequestsReceived",
        "-password"
      );

      res.status(200).json(
        user.friendRequestsReceived
      );
    } catch (error) {
      console.log(
        "Get Friend Requests Error:",
        error.message
      );

      res.status(500).json({
        message:
          "Internal Server Error",
      });
    }
  };