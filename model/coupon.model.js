import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  discountType: {
    type: String,
    enum: ["flat", "percentage"],
    required: true,
    default: "flat",
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
  },
  maxDiscountValue: {
    type: Number,
    required: false, // Optional, mainly for percentage discounts
    min: 0,
  },
  minOrderAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  usageLimit: {
    type: Number, // Max number of times this coupon can be used totally
    default: 100,
  },
  usedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to User model
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Coupon = mongoose.model("coupons", couponSchema);

export default Coupon;