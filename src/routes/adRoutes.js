// Import necessary modules
const express = require("express"); // Express framework for routing
const router = express.Router(); // Create a new router instance

// Import controller functions for handling ad-related operations
const { recordAd, getAd, updateAd, deleteAd, toggleFavorite } = require("../controllers/adController.js");

// Import authentication middleware to protect routes
const { protect } = require("../middleware/authMiddleware.js");

// Define routes for ad management

// Route to create a new ad (protected route)
router.route("/").post(protect, recordAd);

// Route to fetch ads (protected route)
router.get("/", protect, getAd);

// Route to update an ad by its ID (protected route)
router.put("/:id", protect, updateAd);

// Route to delete an ad by its ID (not protected)
router.delete("/:id", deleteAd);

// Route to toggle an ad as favorite by its ID (protected route)
router.post("/:id/favorite", protect, toggleFavorite);

// Export the router for use in other parts of the application
module.exports = router;