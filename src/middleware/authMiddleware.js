// Import necessary modules
const asyncHandler = require("express-async-handler"); // Middleware to handle async errors automatically
const { getUser } = require("./helper.js"); // Import helper function for user retrieval

const protect = asyncHandler(async (req, res, next) => {
   // Retrieve user authentication status and details
  const { status, response } = await getUser(req);

  // If the user is successfully authenticated, attach user data to request object
  if (status === 200) {
    req.user = response;
    next(); // Proceed to the next middleware or route handler
  } else {
    res.status(status).send(response); // Send appropriate error response if authentication fails
  }
});
// Export the middleware function for use in other modules
module.exports = { protect };
