const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req?.headers.authorization?.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT);
        const user = await User.findById(decoded?.id);
        req.user = user;
        // console.log(req);
        next();
      }
    } catch (error) {
      throw new Error("Not Authorised,Please Login Again!");
    }
  } else {
    throw new Error("There is no token attached to the header ...");
  }
});
const isAdmin = asyncHandler(async (req, res, next) => {
  //   console.log(req);
  const { mobile } = req.user;
  const isAdmin = await User.findOne({ mobile: mobile });
  if (isAdmin.roles !== "admin") {
    throw new Error("You are not an Admin.");
  } else {
    next();
  }
});
const isInstructor = asyncHandler(async (req, res, next) => {
  const { mobile } = req.user;
  const isInstructor = await User.findOne({ mobile: mobile });
  if (isInstructor.roles !== "instructor") {
    throw new Error("You are not an Instructor.");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin, isInstructor };
