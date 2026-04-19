import * as userService from "../services/user.services.js";
import CartItem from "../model/cartItem.model.js";

const createCartItem = async (cartItemData) => {
  try {
    const cartItem = new CartItem(cartItemData);

    // Quantity, price, and discountedPrice are already in cartItemData from cart.service.js
    // No need to recalculate here, especially since 'product' is not populated yet.

    const createdCartItem = await cartItem.save();
    return createdCartItem;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateCartItem = async (userId, cartItemId, cartItemData) => {
  try {
    const item = await findCartItemById(cartItemId);
    const user = await userService.findUserById(item.userId);

    if (!user) {
      throw new Error("user not found : " + userId);
    }

    if (user._id.toString() === userId.toString()) {
      // 1. Determine Target Size
      const targetSize = cartItemData.size || item.size;
      const targetQuantity = cartItemData.quantity || item.quantity;

      // 2. Determine Target Variant (Fresh from Product)
      let targetVariant = null;
      
      // Check if product and variants exist
      if (!item.product) {
        throw new Error("Product not found for this cart item");
      }

      if (!Array.isArray(item.product.variants) || item.product.variants.length === 0) {
        throw new Error("Product variants not available");
      }
      
      // If updating variant, find it in product
      if (cartItemData.variant) {
        targetVariant = item.product.variants.find(
          (v) => v._id && v._id.toString() === cartItemData.variant.toString()
        );
        if (!targetVariant) {
          throw new Error("Variant not found");
        }
      } else {
        // If not updating variant, find the current one in product to get fresh stock
        // item.variant might be an object, check if it has _id
        const currentVariantId = item.variant?._id || item.variant?.id; 
        if (currentVariantId) {
             targetVariant = item.product.variants.find(
              (v) => v._id && v._id.toString() === currentVariantId.toString()
            );
        }
        // Fallback if item.variant is not linked or structure is different, though usually it should differ.
        if (!targetVariant && item.variant) {
            // If we can't link back to a product variant (rare), use item.variant but warn it might be stale. 
            // Better to rely on product having variants.
             targetVariant = item.variant; 
        }
      }

      // 3. Validate Stock
      if (targetVariant) {
        // stock is { Size: Quantity, ... }
        const availableStock = targetVariant.stock?.[targetSize] || 0;
        if (availableStock <= 0) {
           throw new Error(`Size ${targetSize} is out of stock for this color`);
        }
        if (availableStock < targetQuantity) {
            throw new Error(`Only ${availableStock} items left in size ${targetSize}`);
        }
        
        // Update the item's variant reference to the fresh one
        item.variant = targetVariant;
      }

      // 4. Update Size in Item
      if (cartItemData.size) {
        item.size = cartItemData.size;
      }

      // 5. Recalculate Prices
      // Determine the base unit price (from fresh variant)
      let unitPrice = item.price / item.quantity; // Default fallback
      if (item.variant && item.variant.price) {
        unitPrice = item.variant.price;
      }

      // Calculate unit discounted price
      const discountPercent = item.product.discountedPercent || 0;
      const unitDiscountedPrice = Math.round(
        unitPrice - (unitPrice * discountPercent) / 100,
      );

      // 6. Handle Quantity Update
      if (cartItemData.quantity) {
        item.quantity = cartItemData.quantity;
      }

      // Final Price Calculation
      item.price = unitPrice * item.quantity;
      item.discountedPrice = unitDiscountedPrice * item.quantity;

      const updatedCartItem = await item.save();
      return updatedCartItem;
    } else {
      throw new Error("you can't update this cart item");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const isCartItemExist = async (cart, product, size, userId, color) => {
  try {
    const query = {
      cart: cart,
      product: product,
      size: size,
      userId: userId,
    };

    if (color) {
      query["variant.color"] = color;
    }

    const cartItem = await CartItem.findOne(query);
    return cartItem;
  } catch (error) {
    throw new Error(error.message);
  }
};

const removeCartItem = async (userId, cartItemId) => {
  try {
    const cartItem = await findCartItemById(cartItemId);
    const user = await userService.findUserById(userId);

    if (user._id.toString() === cartItem.userId.toString()) {
      await CartItem.findByIdAndDelete(cartItemId);
    } else {
      throw new Error("You can't remove another user's item");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const findCartItemById = async (cartItemId) => {
  try {
    const cartItem = await CartItem.findById(cartItemId).populate("product");
    if (cartItem) {
      return cartItem;
    }
    throw new Error("CartItem not found with id : " + cartItemId);
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  createCartItem,
  updateCartItem,
  isCartItemExist,
  removeCartItem,
  findCartItemById,
};