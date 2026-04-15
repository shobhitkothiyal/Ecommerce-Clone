import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userService from "../services/user.services.js";
import * as authService from "../services/auth.service.js";
import generateToken from "../config/jwtprovider.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found with this email",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      jwt: token,
      message: "Admin Login Successful",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};