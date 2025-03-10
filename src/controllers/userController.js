const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const asyncHandler = require("express-async-handler");

const generatedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SALT, { expiresIn: "7d" });
};

// Strong password validation function
const isStrongPassword = (password) => {
  return password.length >= 8;
};

// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill out all fields" });
  }
  
  if (!isStrongPassword(password)) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "simple",
  });

  if (user) {
    res.cookie("token", generatedToken(user._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.cookie("token", generatedToken(user._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});

// VERIFY USER
const verifyUser = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not Authenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SALT);
    const user = await User.findById(decoded.id).select("-password");
    return user
      ? res.json(user)
      : res.status(401).json({ message: "User not found" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// LOGOUT USER
const logoutUser = (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });
  res.status(200).json({ message: "Logged out" });
};

module.exports = { registerUser, loginUser, verifyUser, logoutUser };
