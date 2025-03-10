const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const NOT_AUTHORIZED = "Not authorized";
const NOT_AUTHORIZED_NO_TOKEN = "Not authorized, tokenLESS";

async function getUser(req) {
  let token;
  console.log("checking auth head n cookies");
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token && req.cookies.token) {
    token = req.cookies.token;
    console.log("Token receiver from cookies or header");
  }
  if (!token) {
    console.log("no token received");
    return { status: 401, response: NOT_AUTHORIZED_NO_TOKEN };
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SALT);
    console.log("Decoded token:", decoded);
    const user = await User.findById(decoded.id).select("-password");
    return { status: 200, response: user };
  } catch (error) {
    console.log("Error verifying token:", error);
    return { status: 401, response: NOT_AUTHORIZED };
  }
}
module.exports = { getUser, notAuthorizedMessage: NOT_AUTHORIZED };