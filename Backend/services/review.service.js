import Review from "../model/review.model.js";
import Product from "../model/product.model.js";

async function createReview(reqData, user) {
  const product = await Product.findById(reqData.productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    user: user._id,
    product: product._id,
  });
  if (existingReview) {
    throw new Error("You have already reviewed this product.");
  }

  const review = new Review({
    user: user._id,
    product: product._id,
    name: reqData.name, // Or use user.firstName + user.lastName
    rating: reqData.rating,
    comment: reqData.comment,
    headline: reqData.headline,
    images: reqData.images,
    createdAt: new Date(),
  });

  await review.save();

  // Recalculate average rating
  const reviews = await Review.find({ product: product._id });
  const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
  const rating = reviews.length > 0 ? totalRating / reviews.length : 0;
  const numReviews = reviews.length;

  // Use atomic update to ensure reviews array and stats are updated correctly
  await Product.findByIdAndUpdate(product._id, {
    $push: { reviews: review._id },
    $set: { rating, numReviews },
  });

  return review;
}

async function getAllReview(productId) {
  const product = await Product.findById(productId).populate("reviews");
  if (!product) {
    throw new Error("Product not found");
  }
  return product.reviews;
}

export default {
  createReview,
  getAllReview,
};