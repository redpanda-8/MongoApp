// Import necessary modules
const express = require("express"); // Express framework for building the server
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing
const cookieParser = require("cookie-parser"); // Middleware to handle cookies
require("dotenv").config(); // Load environment variables from a .env file

// Import custom error handling middleware
const { errorHandler } = require("./middleware/errorHandler.js");

// Import database connection function
const connectingDB = require("./config/db.js");

// Establish connection to the database
connectingDB();

// Initialize the Express application
const app = express();

// CORS configuration options
const corsOptions = {
    origin: "http://127.0.0.1:5500", // Define the allowed origin for requests
    methods: ["GET", "POST", "DELETE", "PUT"], // Specify permitted HTTP methods
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
    allowedHeaders: ["Content-Type", "Authorization"] // Specify allowed headers
};

// Handle CORS preflight requests for all routes
app.options("*", cors(corsOptions));
// Enable CORS for all routes with specified options
app.use(cors(corsOptions));

// Middleware to parse incoming URL-encoded data
app.use(express.urlencoded({ extended: false }));
// Middleware to parse incoming JSON data
app.use(express.json());
// Middleware to handle cookies
app.use(cookieParser());

// Serve static files from the "public" directory
app.use(express.static("public"));

// Route handlers - Mount specific route modules
app.use("/ads", require("./routes/adRoutes.js")); // Handle ad-related requests
app.use("/users", require("./routes/userRoutes.js")); // Handle user-related requests
app.use("/auth", require("./routes/userRoutes.js")); // Handle authentication requests (uses user routes)
app.use("/category", require("./routes/categoryRoutes.js")); // Handle category-related requests

// Global error handling middleware
app.use(errorHandler);

// Handle unhandled promise rejections globally
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Handle uncaught exceptions globally and exit the process
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1); // Exit process to avoid undefined behavior
});

// Export the Express application instance
module.exports = app;

// Uncomment the following lines if you want to start the server within this file
// const PORT = process.env.PORT || 999;
// app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
