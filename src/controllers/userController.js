const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const generatedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SALT, { expiresIn: "30d" });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }
  // user exists?
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  // hash password
  console.log("hashing password");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "simple",
  });
  console.log("checking user");
  if (user) {
    console.log("user made");
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generatedToken(user._id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @ login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {

    res.cookie("token",generatedToken(user._id),{
      httpOnly:true,
      secure:false,
      sameSite:"Strict",
      maxAge:7*24*60*60*1000,
      path:"/"
    });

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      //token: generatedToken(user._id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @ verify
const verifyUser=asyncHandler(async(req,res)=>{
  const token=req.cookies.token
  if (!token){
    return res.status(401).json({message:"Not Authenticated"})
  }
  try{
    const decoded=jwt.verify(token,process.env.JWT_SALT)
    const user=await User.findById(decoded.id).select("-password");
    user ? res.json(user) : res.status(401).json({ message: "User not found" });
  }catch(error){
    res.status(401).json({message: "Invalid token"})
  }
})
// @ logout
const logoutUser = (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true, path: "/" });  // Clear the HttpOnly cookie
  res.status(200).json({ message: "Logged out" });
};
// @ get users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({role: { $ne: "admin"}}).select('-password');
  res.status(200).json(users);
});
// @ delete user by ID
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new Error("User not found");
  }
  res.status(200).json({ message: "User deleted successfully" });
});
// @ toggle block status
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new Error("User not found");
  }
  
  user.isBlocked = !user.isBlocked;
  await user.save();
  
  res.status(200).json({
    message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
    isBlocked: user.isBlocked
  });
});
module.exports = { registerUser, loginUser, verifyUser,logoutUser,getUsers,deleteUser,toggleBlockUser };
