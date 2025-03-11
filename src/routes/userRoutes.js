// Import necessary modules
const express = require("express"); // Express framework for routing
const router = express.Router(); // Create a new router instance

// Import controller functions for handling user-related operations
const { registerUser, loginUser, verifyUser, logoutUser, getUsers, deleteUser, toggleBlockUser } = require("../controllers/userController.js");

// Define routes for user management

// Route to register a new user
router.post("/", registerUser);

// Route to log in an existing user
router.post("/login", loginUser);

// Route to verify a user session
router.get("/verify", verifyUser);

// Route to log out a user
router.post("/logout", logoutUser);

// Route to get a list of all users
router.get("/", getUsers);

// Route to delete a user by their ID
router.delete("/:id", deleteUser);

// Route to toggle a user's blocked status by their ID
router.put("/:id/toggle-block", toggleBlockUser);

// Export the router for use in other parts of the application
module.exports = router;
