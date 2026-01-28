import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("reviews", reviewSchema);

export default Review;