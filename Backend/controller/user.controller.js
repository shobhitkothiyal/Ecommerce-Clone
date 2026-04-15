import * as userService from "../services/user.services.js";

export const addAddress = async (req, res) => {
  try {
    const user = req.user;
    const addressData = req.body;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const address = await userService.createAddress(user, addressData);
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    const user = req.user; // Assuming req.user is set by auth middleware
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const addresses = await userService.getAllAddresses(user._id);
    res.status(200).json(addresses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const removeAddress = async (req, res) => {
  try {
    const user = req.user;
    const { addressId } = req.params;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const result = await userService.deleteAddress(user._id, addressId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const editAddress = async (req, res) => {
  try {
    const user = req.user;
    const { addressId } = req.params;
    const addressData = req.body;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const address = await userService.updateAddress(
      user._id,
      addressId,
      addressData
    );
    res.status(200).json(address);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const user = req.user;
    const { productId } = req.body;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const wishlist = await userService.addToWishlist(user._id, productId);
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const user = req.user;
    const { productId } = req.body; // Or req.params depending on route choice
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const wishlist = await userService.removeFromWishlist(user._id, productId);
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const wishlist = await userService.getWishlist(user._id);
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await userService.getAllUsers(page, limit);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};