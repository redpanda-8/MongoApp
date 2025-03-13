// Error handling middleware
// This middleware is responsible for handling errors across the application
const errorHandler = (err, req, res, next) => {
  // Determine the appropriate HTTP status code for the error response
  const statusCode = res.statusCode ? res.statusCode : 500;
  // Set the response status code
  res.status(statusCode);
  // Send a JSON response containing error details
  res.json({
    message: err.message, // Error msg describing what went wrong

    /**
     * Stack trace information provides details about where the error occurred in the code.
     * It is useful for debugging but can expose internal server details.
     * To prevent security risks, it is shown only in non-production environments.
     *
     * - If NODE_ENV is set to "production", the stack trace is hidden (null value returned).
     * - If NODE_ENV is not "production" (e.g., "development" or "testing"), the stack trace is included.
     */
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
// Export the error handler middleware for use in the application
module.exports = { errorHandler };
