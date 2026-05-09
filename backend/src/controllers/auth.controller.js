import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";


// ========================
// SIGNUP
// ========================
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // create user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // generate token AFTER saving user
    const token = generateToken(newUser._id, res);

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      token,
    });
  } catch (error) {
    console.log("Signup Error:", error.message);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// ========================
// LOGIN
// ========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const isPasswordCorrect = user
      ? await bcrypt.compare(
          password,
          user.password
        )
      : false;

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // generate token
    const token = generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      token,
    });
  } catch (error) {
    console.log("Login Error:", error.message);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// ========================
// LOGOUT
// ========================
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0),
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Logout Error:", error.message);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
