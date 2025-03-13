// Import necessary modules
const asyncHandler = require("express-async-handler"); // Middleware to handle async errors automatically
const { getUser, notAuthorizedMessage } = require("./helper.js"); // Import helper functions

const protectAdmin = asyncHandler(async (req, res, next) => {
  // Retrieve user authentication status and details
  const { status, response } = await getUser(req);
  // Check if user retrieval was successful
  if (status === 200) {
    // Verify if the user has an "admin" role
    if (response.role === "admin") {
      req.user = response; // Attach user data to request object
      next(); // Proceed to the next middleware or route handler
    } else {
      res.status(401).send(notAuthorizedMessage); // Send unauthorized response
    }
  } else {
    res.status(status).send(response);// Send appropriate error response
  }
});
// Export the middleware function for use in other modules
module.exports = { protectAdmin };