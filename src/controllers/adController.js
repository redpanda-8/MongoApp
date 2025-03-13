// Import necessary modules
const asyncHandler = require("express-async-handler"); // Middleware to handle async errors
const Ad = require("../models/Ad.js"); // Import Ad model

// @ POST /ads route
// Create a new advertisement - Protected access(requires authentication)

const recordAd = asyncHandler(async (req, res) => {
  // Extract required fields from request body
  const { title, category, description, price, link } = req.body;
  // Validate input fields
  if (!title || !description || !price || !link) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }
  // Create a new ad entry in the database
  const ad = await Ad.create({
    title,
    description,
    category,
    price,
    link,
    user: req.user.id, // Associate ad with authenticated user
  });
  res.status(200).json(ad); // Return the created ad
});

// @ GET /ads route
// Fetch all advertisements with favorite status - Public access
const getAd = asyncHandler(async (req, res) => {
  // Retrieve all ads from the database
  const ads = await Ad.find({}); 
  // Map over ads to include additional favorite-related data
  const adsWithFavorites = ads.map((ad) => {
    const adObj = ad.toObject(); // Convert Mongoose document to plain object
    console.log("Ad details:", adObj);

    // Ensure favorites is an array
    adObj.favorites = ad.favorites || [];

    // Determine if the current user has favorited the ad
    console.log("Authenticated user:", req.user);
    if (req.user && req.user.id) {
      adObj.isFavoritedBy = adObj.favorites.includes(req.user.id);
    } else {
      adObj.isFavoritedBy = false; // Default to false if user is not authenticated
    }

    // Count total number of favorites for the ad
    adObj.favoritesCount = adObj.favorites.length;
    return adObj;
  });

  res.status(200).json(adsWithFavorites); // Return modified ads
});

// PUT /ads/:id route
// Update an existing advertisement - Protected access(Only owner or admin can update)
const updateAd = asyncHandler(async (req, res) => {
  const { title, description, price, link } = req.body;
  const ad = await Ad.findById(req.params.id);

  // Check if the authenticated user is the ad owner or an admin
  if (ad.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Validate required fields
  if (!title || !description || !price || !link) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  // Update the ad in the database
  const updatedAd = await Ad.findByIdAndUpdate(
    req.params.id,
    { title, description, price, link },
    { new: true } // Return the updated document
  );

  res.status(200).json(updatedAd); // Return updated ad
});

// DELETE /ads/:id route
// Delete an advertisement - Protected access(Only owner or admin can delete)
const deleteAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findByIdAndDelete(req.params.id);
  res.status(200).json(ad); // Return deleted ad
});

// POST /ads/:id/favorite route
// Toggle favorite status of an advertisement - Protected access(Requires authentication)
const toggleFavorite = asyncHandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    res.status(404);
    throw new Error("Ad not found");
  }

  // Check if the user has already favorited the ad
  const isFavorited = ad.favorites.includes(req.user.id);

  // Update favorites list: remove if already favorited, add if not
  /**
   * Update the favorites list dynamically:
   * - If the ad is already favorited, remove the user's ID from the favorites array using `$pull`.
   * - If the ad is not yet favorited, add the user's ID using `$addToSet` (prevents duplicates).
   */
  const updatedAd = await Ad.findByIdAndUpdate(
    req.params.id,
    { [isFavorited ? "$pull" : "$addToSet"]: { favorites: req.user.id } },
    { new: true, validateBeforeSave: false }
  );

  res.status(200).json({
    isFavorited: !isFavorited, // Toggle favorite status
    favoritesCount: updatedAd.favorites.length, // Update favorite count
    favorites: updatedAd.favorites, // Return updated favorites list
  });
});

// Export controller functions
module.exports = { recordAd, getAd, updateAd, deleteAd, toggleFavorite };