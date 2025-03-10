const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    title: {
      type: String,
      required: [true, "title cant be empty"],
    },
    category:{type:String, required:true},
    description: {
      type: String,
      required: [true, "description name cant be empty"],
    },
    price: { type: Number, required: [true, "price cant be empty"] },
    link: {type :String, required:true},
    favorites: [{type:mongoose.Schema.Types.ObjectId, ref: "User"}]
  },
  { timestamps: true }
);

adSchema.methods.isFavoritedBy = function(userId) {
  return this.favorites.includes(userId);
};
module.exports = mongoose.model("Ad", adSchema);