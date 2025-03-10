const express = require("express");
const router = express.Router();
const { recordCategory, getCategories, deleteCategory } = require("../controllers/categoryController.js");
router.post("/",recordCategory);
router.get("/", getCategories);
router.delete("/:id", deleteCategory);
module.exports = router;