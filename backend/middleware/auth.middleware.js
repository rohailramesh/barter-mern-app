import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "No access token provided" });
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password"); //don't want to send the password too
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Access token expired" });
      }
      return res.status(401).json({ message: "Invalid access token" });
    }
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res.status(401).json({ message: error.message });
  }
};

//get the access token form cookie using the cookieparser
//verify the access token using jwt with the secret key
//get the user by searching for decoded user id from the token
//set the user in request to the user from the database
//move to next middleware

export const adminRoute = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    //if the user in request exists and also the role is admin then move to next middleware
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// purpose of next() is to move to the next middleware and eventually to the controller
