import Cart from "../model/cart.model.js";
import CartItem from "../model/cartItem.model.js"; // Needed for find
import productService from "../services/product.service.js";
import cartItemService from "../services/cartItem.service.js";
import couponService from "../services/coupon.service.js";

const createCart = async (user) => {
  try {
    const cart = new Cart({ user });
    const createdCart = await cart.save();
    return createdCart;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUserCart = async (userId) => {
  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create cart if not exists (auto-heal)
      cart = await createCart(userId);
    }

    let cartItems = await CartItem.find({ cart: cart._id }).populate("product");

    // Convert to plain object so we can overwrite cartItems
    const cartObject = cart.toObject();
    cartObject.cartItems = cartItems;

    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = 0;

    for (let cartItem of cartItems) {
      totalPrice += cartItem.price;
      totalDiscountedPrice += cartItem.discountedPrice;
      totalItem += cartItem.quantity;
    }

    cartObject.totalPrice = totalPrice;
    cartObject.totalItem = totalItem;
    cartObject.totalDiscountedPrice = totalDiscountedPrice;
    cartObject.discount = totalPrice - totalDiscountedPrice;

    // Apply Coupon Logic
    if (cart.coupon) {
      try {
        const couponResult = await couponService.applyCoupon(
          cart.couponCode || "", // Or fetch coupon code if not stored, but we stored it
          cartObject.totalDiscountedPrice, // Apply coupon on the discounted price? Or base price? Usually Discounted.
          userId,
        );
        cartObject.couponDiscount = couponResult.discountAmount;
        cartObject.totalDiscountedPrice = couponResult.finalAmount;
        cartObject.couponCode = cart.couponCode;
      } catch (err) {
        // Coupon invalid or expired?
        console.error("Applied coupon invalid:", err.message);
        // Should we remove it automatically? Maybe not, just don't apply discount.
        cartObject.couponError = err.message;
      }
    }

    return cartObject;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addCartItem = async (userId, req) => {
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await createCart(userId);
    }
    const product = await productService.findProductById(req.productId);

    const isPresent = await cartItemService.isCartItemExist(
      cart._id,
      product._id,
      req.size,
      userId,
    );

    if (!isPresent) {
      let price = product.price;
      if (!price && product.variants && product.variants.length > 0) {
        if (req.variant && req.variant.price) {
          price = req.variant.price;
        } else {
          price = product.variants[0].price;
        }
      }

      let discountedPrice = price;
      if (product.discountedPercent > 0) {
        discountedPrice = price - (price * product.discountedPercent) / 100;
      }

      const cartItemData = {
        product: product._id,
        cart: cart._id,
        quantity: 1,
        userId,
        price: price,
        discountedPrice: discountedPrice,
        size: req.size,
        variant: req.variant, // Optional store of variant details
      };

      const createdCartItem =
        await cartItemService.createCartItem(cartItemData);
      cart.cartItems.push(createdCartItem);
      await cart.save();
      return createdCartItem; // Or return updated cart? Usually return generic success or updated cart.
    }

    // Item Exists -> Increment Quantity
    const newQuantity = isPresent.quantity + 1;

    // Update logic handled by cartItemService which recalculates prices
    const updatedCartItem = await cartItemService.updateCartItem(
      userId,
      isPresent._id,
      { quantity: newQuantity },
    );
    return updatedCartItem;
  } catch (error) {
    throw new Error(error.message);
  }
};

const applyCoupon = async (userId, code) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    // Validate Coupon first (Dry Run)
    // We need current total to validate min order amount
    // Re-calculating total here roughly or reusing findUserCart logic?
    // findUserCart logic is internal. Let's do a quick calc or rely on Coupon Service to validate.
    // CouponService.applyCoupon checks minOrderAmount.

    // We need total of cart items.
    const cartItems = await CartItem.find({ cart: cart._id });
    let currentTotal = 0;
    for (let item of cartItems) {
      currentTotal += item.discountedPrice;
    }

    const result = await couponService.applyCoupon(code, currentTotal, userId);

    // If successful, save to cart
    cart.coupon = result.coupon._id;
    cart.couponCode = result.coupon.code;
    await cart.save();

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const removeCoupon = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.coupon = null;
      cart.couponCode = null;
      await cart.save();
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const clearUserCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return;

    await CartItem.deleteMany({ cart: cart._id });
    cart.cartItems = [];
    cart.totalPrice = 0;
    cart.totalItem = 0;
    cart.totalDiscountedPrice = 0;
    cart.discount = 0;
    cart.coupon = null;
    cart.couponCode = null;
    await cart.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  createCart,
  findUserCart,
  addCartItem,
  clearUserCart,
  applyCoupon,
  removeCoupon,
};