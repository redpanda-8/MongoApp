const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "first name cant be empty"] },
    email: {
      type: String,
      required: [true, "email cant be empty"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password cant be empty, user.js"],
    },
    role: { type: String, default: "simple" },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);