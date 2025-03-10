const asyncHandler = require("express-async-handler");
const Category=require("../models/Category.js")
// @ post category
const recordCategory=asyncHandler(async(req,res)=>{
  if (!req.body.name) throw new Error("Fill out category name");
  const categoryExists = await Category.findOne({ name: req.body.name });
  if (categoryExists) {
    throw new Error("Category with this name already exists");
  }
  const category = await Category.create({
    name: req.body.name
  })
  res.status(201).json(category)
})
// @ get category
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json(categories);
});
// @ delete category
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new Error("Category not found");
  }
  res.status(200).json({ message: "Category deleted" });
});

module.exports={ recordCategory, getCategories, deleteCategory }