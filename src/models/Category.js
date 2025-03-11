// Import necessary modules
const mongoose = require("mongoose"); // Mongoose library for MongoDB interactions

// Define the schema for a category
const categorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Category name cannot be empty"], // Validation message for missing category name
      unique: true, // Ensure category names are unique
      trim: true // Remove whitespace from the name
    }
  }
);

// Export the Category model based on the schema
module.exports = mongoose.model("Category", categorySchema);
