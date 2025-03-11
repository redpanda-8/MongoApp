// Import necessary modules
const express = require("express"); // Express framework for routing
const router = express.Router(); // Create a new router instance

// Import controller functions for handling category-related operations
const { recordCategory, getCategories, deleteCategory } = require("../controllers/categoryController.js");

// Define routes for category management

// Route to create a new category
router.post("/", recordCategory);

// Route to fetch all categories
router.get("/", getCategories);

// Route to delete a category by its ID
router.delete("/:id", deleteCategory);

// Export the router for use in other parts of the application
module.exports = router;
