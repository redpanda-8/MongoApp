const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "category name cant be empty"],unique:true,trim:true }
  },
);
module.exports = mongoose.model("Category", categorySchema);