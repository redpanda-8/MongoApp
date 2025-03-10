const express = require("express");
const router = express.Router();
const { registerUser, loginUser, verifyUser, logoutUser } = require("../controllers/userController.js");
const { loginLimiter } = require("../middleware/rateLimit.js");

// Apply rate limit only on login route
router.post("/", registerUser);
router.post("/login", loginLimiter, loginUser);
router.get("/verify", verifyUser);
router.post("/logout", logoutUser);

module.exports = router;
