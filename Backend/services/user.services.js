import User from "../model/user.model.js";
import Address from "../model/address.model.js";

export const createAddress = async (userData, addressData) => {
  try {
    const user = await User.findById(userData._id);
    if (!user) {
      throw new Error("User not found");
    }

    const address = new Address({
      ...addressData,
      user: user._id,
    });

    if (addressData.isDefault) {
      await Address.updateMany({ user: user._id }, { isDefault: false });
    }

    await address.save();

    user.addresses.push(address._id);
    await user.save();

    return address;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getAllAddresses = async (userId) => {
  try {
    const user = await User.findById(userId).populate("addresses");
    if (!user) {
      throw new Error("User not found");
    }
    return user.addresses;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findUserById = async (userId) => {
  try {
    // First find user without Populate to check for bad data
    let user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found with id: " + userId);
    }
    // Now try to populate wishlist
    try {
      await user.populate("wishlist");
    } catch (populateErr) {
      console.error("Populate wishlist failed:", populateErr);
      // If populate fails, clear the wishlist or return user without populated wishlist?
      // Let's clear the wishlist to be safe and save.
      user.wishlist = [];
      await user.save();
    }

    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteAddress = async (userId, addressId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Remove address reference from user
    user.addresses = user.addresses.filter((id) => id.toString() !== addressId);
    await user.save();

    // Delete the address document
    await Address.findByIdAndDelete(addressId);

    return { message: "Address deleted successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateAddress = async (userId, addressId, addressData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if address belongs to user (optional but good for security)
    if (!user.addresses.includes(addressId)) {
      throw new Error("Address not found for this user");
    }

    if (addressData.isDefault) {
      await Address.updateMany({ user: user._id }, { isDefault: false });
    }

    const address = await Address.findByIdAndUpdate(addressId, addressData, {
      new: true,
    }); // new: true returns the updated document

    if (!address) {
      throw new Error("Address not found");
    }

    return address;
  } catch (err) {
    throw new Error(err.message);
  }
};
export const addToWishlist = async (userId, productId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    // Return populated wishlist for frontend update
    const populatedUser = await User.findById(userId).populate("wishlist");
    return populatedUser.wishlist;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const removeFromWishlist = async (userId, productId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    // Return populated wishlist for frontend update
    const populatedUser = await User.findById(userId).populate("wishlist");
    return populatedUser.wishlist;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getWishlist = async (userId) => {
  try {
    const user = await User.findById(userId).populate("wishlist");
    if (!user) throw new Error("User not found");
    return user.wishlist;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .populate("addresses")
      .populate("orders"); // Populate orders to show count/details if needed

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    return { users, totalPages, currentPage: page, totalUsers };
  } catch (err) {
    throw new Error(err.message);
  }
};

export default {
  createAddress,
  getAllAddresses,
  findUserById,
  deleteAddress,
  updateAddress,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getAllUsers,
};