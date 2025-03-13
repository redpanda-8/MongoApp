// Import necessary modules
const asyncHandler = require("express-async-handler"); // Middleware to handle async errors
const Category = require("../models/Category.js"); // Import Category model

// POST /categories route
// Create a new category - Protected (Requires authentication)
const recordCategory = asyncHandler(async (req, res) => {
  // Ensure category name is provided
  if (!req.body.name) {
    throw new Error("Fill out category name");
  }

  // Check if a category with the same name already exists
  const categoryExists = await Category.findOne({ name: req.body.name });
  if (categoryExists) {
    throw new Error("Category with this name already exists");
  }

  // Create new category entry in the database
  const category = await Category.create({
    name: req.body.name,
  });

  res.status(201).json(category); // Return the created category
});

// GET /categories route
// Retrieve all categories - Public access
const getCategories = asyncHandler(async (req, res) => {
  // Fetch all categories from the database
  const categories = await Category.find({});
  res.status(200).json(categories); // Return categories list
});

// DELETE /categories/:id route
// Delete a category by its ID - Protected access(Requires authentication, typically admin role)
const deleteCategory = asyncHandler(async (req, res) => {
  // Find and delete category by ID
  const category = await Category.findByIdAndDelete(req.params.id);

  // If category does not exist, return an error
  if (!category) {
    throw new Error("Category not found");
  }

  res.status(200).json({ message: "Category deleted" }); // Return success message
});

// Export controller functions
module.exports = { recordCategory, getCategories, deleteCategory };