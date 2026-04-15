import mongoose from "mongoose";

// Product Schema
const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  category: {
    type: String,
  },
  topLevelCategory: {
    type: String,
  },
  secondLevelCategory: {
    type: String,
  },
  thirdLevelCategory: {
    type: String,
  },
  images: [String],
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reviews",
    },
  ],
  numReviews: {
    type: Number,
    default: 0,
  },
  discountedPercent: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: false, // Not strictly required at DB level to avoid migration issues, but enforced in logic
  },
  discountedPrice: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
  },
  variants: [
  {
    color: { type: String, required: true }, // "Red & Green"

    // SINGLE COLOR
    hex: { type: String, default: "" },
    manuallyOutOfStock: { type: Boolean, default: false },

    // DUAL COLOR (NEW 🔥)
    colors: { type: [String], default: [] }, // ["#ff0000", "#00ff00"]

    price: Number,
    images: [String],

    stock: {
      type: mongoose.Schema.Types.Mixed, // keep as-is
    },
  },
],

  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("products", productSchema);

export default Product;