// Import necessary modules
const mongoose = require("mongoose");  // Mongoose library for MongoDB interactions

// Define the schema for a user
const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "First name cannot be empty"] // Validation message for missing name
    },
    email: {
      type: String,
      required: [true, "Email cannot be empty"], // Validation message for missing email
      unique: true // Ensure email is unique in the database
    },
    password: {
      type: String,
      required: [true, "Password cannot be empty"] // Validation message for missing password
    },
    role: { 
      type: String, 
      default: "simple" // Default role assigned to a user
    },
    isBlocked: { 
      type: Boolean, 
      default: false // Default value for blocking status
    }
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Export the User model based on the schema
module.exports = mongoose.model("User", userSchema);
