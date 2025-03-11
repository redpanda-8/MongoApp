const asyncHandler = require("express-async-handler");
const Ad = require("../models/Ad.js");

// @ post
// @ route /ads
const recordAd = asyncHandler(async (req, res) => {
  const { title, category, description, price, link } = req.body;
  if (!title || !description || !price || !link) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }
  const ad = await Ad.create({
    title,
    description,
    category,
    price,
    link,
    user: req.user.id,
  });
  res.status(200).json(ad);
});

// @ get add /ads
const getAd = asyncHandler(async (req, res) => {
  const ads = await Ad.find({});

  const adsWithFavorites = ads.map(ad => {
    const adObj = ad.toObject();
    console.log("your ad:",adObj)

    // Ensure favorites is an array
    adObj.favorites = ad.favorites || [];

    // Add isFavoritedBy if user is authenticated
    console.log("req.user: ",req.user)
    console.log("req.user.id: ",req.user.id)
    if (req.user && req.user.id) {
      adObj.isFavoritedBy = adObj.favorites.includes(req.user.id);
    } else {
      adObj.isFavoritedBy = false; // Default to false if user is not authenticated
    }

    // Add favoritesCount
    adObj.favoritesCount = adObj.favorites.length;

    return adObj;
  });


  res.status(200).json(adsWithFavorites);
});

// @ update
const updateAd = asyncHandler(async (req, res) => {

  const { title, description, price, link } = req.body;

  const ad = await Ad.findById(req.params.id);

  if (ad.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error("User not authorized");
    }

  if (!title || !description || !price || !link) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }
  const updatedAd = await Ad.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      price,
      link
    },
    {new:true}
  );
  res.status(200).json(updatedAd);
});
// @ delete /ads/:id
const deleteAd = asyncHandler(async(req,res)=>{
  const ad = await Ad.findByIdAndDelete(req.params.id)
  res.status(200).json(ad)
})
// @ toggle favorite
const toggleFavorite = asyncHandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    res.status(404);
    throw new Error("Ad not found");
  }

  const isFavorited = ad.favorites.includes(req.user.id);

  const updatedAd = await Ad.findByIdAndUpdate(
    req.params.id,
    {
      [isFavorited ? "$pull" : "$addToSet"]: { favorites: req.user.id }
    },
    { new: true, validateBeforeSave: false }
  );

  res.status(200).json({
    isFavorited: !isFavorited,
    favoritesCount: updatedAd.favorites.length,
    favorites: updatedAd.favorites
  });
});
module.exports = { recordAd, getAd,updateAd,deleteAd, toggleFavorite };
