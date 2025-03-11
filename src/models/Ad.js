// Import necessary modules
const mongoose = require("mongoose"); // Mongoose library for MongoDB interactions

// Define the schema for an advertisement
const adSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      required: true, // User association is mandatory
      ref: "User" // Reference to the "User" collection
    },
    title: {
      type: String,
      required: [true, "Title cannot be empty"], // Validation message for missing title
    },
    category: {
      type: String, 
      required: true // Category is mandatory
    },
    description: {
      type: String,
      required: [true, "Description cannot be empty"], // Validation message for missing description
    },
    price: { 
      type: Number, 
      required: [true, "Price cannot be empty"] // Price must be specified
    },
    link: {
      type: String, 
      required: true // External link is required
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" // Array of user IDs who favorited the ad
      }
    ]
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Define a method to check if a user has favorited the ad
adSchema.methods.isFavoritedBy = function(userId) {
  return this.favorites.includes(userId); // Returns true if the user ID exists in favorites
};

// Export the Ad model based on the schema
module.exports = mongoose.model("Ad", adSchema);