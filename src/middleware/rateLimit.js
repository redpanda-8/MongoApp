const rateLimit = require("express-rate-limit");

// Limit login attempts to 5 requests per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: "Too many login attempts, please try again later." },
  headers: true,
});

module.exports = { loginLimiter };
