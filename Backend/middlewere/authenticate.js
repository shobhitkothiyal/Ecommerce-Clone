import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import * as userService from "../services/user.services.js";

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(401).json({ message: "Invalid user ID in token" });
    }

    const user = await userService.findUserById(decoded.userId);
    req.user = user;
    next();
  } catch (err) {
    console.log("Auth Error:", err.name, err.message); // Debug log
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    return res.status(500).json({ error: err.message });
  }
};

export default authenticate;