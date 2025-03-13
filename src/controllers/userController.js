// Import necessary modules
const User = require("../models/User.js"); // User model for database interactions
const jwt = require("jsonwebtoken"); // JSON Web Token library for authentication
const bcrypt = require("bcrypt"); // Library for password hashing
require("dotenv").config(); // Load environment variables from .env file
const asyncHandler = require("express-async-handler"); // Middleware to handle async errors

/**
 * Generate a JWT token for a given user ID
 * @param {string} id - User ID to encode in the token
 * @returns {string} - Signed JWT token valid for 30 days
 */
const generatedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SALT, { expiresIn: "30d" });
};

// POST /users route
// Register a new user - Public access
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash the password before storing it
  console.log("Hashing password");
  //   /*
  //  * Generate a salt, which is a random string added to the password
  // * before hashing to increase security and prevent precomputed attacks (rainbow tables).
  // * The value 10 represents the number of salt rounds, meaning the computational cost of generating the salt.
  // *//
  const salt = await bcrypt.genSalt(10);
  /**
   * Hash the password using the generated salt.
   * The bcrypt.hash function takes the plain text password and the salt,
   * and produces a hashed version of the password that will be stored in the database.
   */
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user entry in the database
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "simple",
  });

  // Check if user creation was successful
  if (user) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generatedToken(user._id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// POST /users/login route
// Authenticate user and set a JWT cookie - Public access
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // Verify user and compare passwords
  if (user && (await bcrypt.compare(password, user.password))) {
    res.cookie("token", generatedToken(user._id), {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
      path: "/",
    });

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});
// GET /users/verify
// Verify user authentication using JWT cookie - Protected access
const verifyUser = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not Authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SALT);
    const user = await User.findById(decoded.id).select("-password");
    user ? res.json(user) : res.status(401).json({ message: "User not found" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// POST /users/logout route
// Logout user by clearing JWT cookie - Protected access
const logoutUser = (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true, path: "/" }); // Clear the HttpOnly cookie
  res.status(200).json({ message: "Logged out" });
};

// GET /users route
// Get all non-admin users - Protected access(Admin-only access recommended) 
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: { $ne: "admin" } }).select("-password");
  res.status(200).json(users);
});

// DELETE /users/:id route
// Delete user by ID - Protected access(Admin-only access recommended) 
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new Error("User not found");
  }
  res.status(200).json({ message: "User deleted successfully" });
});

// PUT /users/:id/toggle-block route
// Toggle block status of a user - Protected access(Admin-only access recommended)
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new Error("User not found");
  }

  // Toggle the isBlocked status
  user.isBlocked = !user.isBlocked;
  await user.save();

  res.status(200).json({
    message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
    isBlocked: user.isBlocked,
  });
});

// Export controller functions
module.exports = { registerUser, loginUser, verifyUser, logoutUser, getUsers, deleteUser, toggleBlockUser };
