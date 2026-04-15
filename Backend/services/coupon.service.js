import Coupon from "../model/coupon.model.js";

const createCoupon = async (reqData) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      usageLimit,
      isActive,
      expiresAt,
      maxDiscountValue,
    } = reqData;

    // Check if coupon exists
    const isExist = await Coupon.findOne({ code: code.toUpperCase() });
    if (isExist) {
      throw new Error("Coupon already exists with this code");
    }

    const coupon = new Coupon({
      code,
      discountType,
      discountValue,
      minOrderAmount,
      usageLimit,
      isActive,
      expiresAt,
      maxDiscountValue,
    });

    return await coupon.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllCoupons = async () => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return coupons;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteCoupon = async (couponId) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(couponId);
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    return coupon;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateCoupon = async (couponId, reqData) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(couponId, reqData, {
      new: true,
    });
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    return coupon;
  } catch (error) {
    throw new Error(error.message);
  }
};

const applyCoupon = async (code, orderAmount, userId) => {
  try {
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      throw new Error("Invalid or inactive coupon code");
    }

    if (new Date() > coupon.expiresAt) {
      throw new Error("Coupon has expired");
    }

    if (orderAmount < coupon.minOrderAmount) {
      throw new Error(`Minimum order amount ${coupon.minOrderAmount} required`);
    }

    if (coupon.usedBy.length >= coupon.usageLimit) {
      throw new Error("Coupon usage limit exceeded");
    }

    if (coupon.usedBy.includes(userId)) {
      throw new Error("You have already used this coupon");
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountValue && coupon.maxDiscountValue > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountValue);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return {
      coupon: coupon,
      discountAmount,
      finalAmount: orderAmount - discountAmount,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  updateCoupon,
  applyCoupon,
};