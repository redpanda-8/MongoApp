const express = require("express");
const router = express.Router();
const { recordAd, getAd,updateAd, deleteAd, toggleFavorite } = require("../controllers/adController.js");
const { protect } = require("../middleware/authMiddleware.js");
router.route("/").post(protect, recordAd);
router.get("/",protect,getAd)
router.put("/:id",protect,updateAd)
router.delete("/:id",deleteAd)
router.post("/:id/favorite",protect,toggleFavorite)
module.exports = router;