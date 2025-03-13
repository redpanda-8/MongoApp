// Import necessary modules
const jwt = require("jsonwebtoken"); // JSON Web Token library for authentication
const User = require("../models/User.js"); // User model for database interactions
// Authorization messages
const NOT_AUTHORIZED = "Not authorized"; // Message for unauthorized access
const NOT_AUTHORIZED_NO_TOKEN = "Not authorized, tokenLESS"; // Message for missing token

async function getUser(req) {
  let token; // Variable to store the extracted token
  console.log("checking auth head n cookies");
  // Check if the token is present in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // Extract token from the Bearer header
  }
  // If the token was not found in the headers, check for it in the cookies
  if (!token && req.cookies.token) {
    token = req.cookies.token; // Extract token from cookies
    console.log("Token receiver from cookies or header");
  }
  // If no token is found, return a 401 Unauthorized response
  if (!token) {
    console.log("no token received");
    return { status: 401, response: NOT_AUTHORIZED_NO_TOKEN };
  }
  try {
    // Verify the token using the JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SALT);
    console.log("Decoded token:", decoded);
    // Find the user in the database based on the decoded token ID, excluding the password field
    const user = await User.findById(decoded.id).select("-password");
    return { status: 200, response: user }; // Return user data with a 200 status (success)
  } catch (error) {
    // Handle errors during token verification
    console.log("Error verifying token:", error);
    return { status: 401, response: NOT_AUTHORIZED };
  }
}
// Export the function and authorization message for use in other modules
module.exports = { getUser, notAuthorizedMessage: NOT_AUTHORIZED };
