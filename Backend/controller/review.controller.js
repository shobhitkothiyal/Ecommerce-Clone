import reviewService from "../services/review.service.js";

const createReview = async (req, res) => {
  const user = req.user;
  try {
    const images = req.files ? req.files.map((file) => file.path) : [];
    const reviewData = {
      ...req.body,
      images,
    };
    const review = await reviewService.createReview(reviewData, user);
    return res.status(201).send(review);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getAllReview = async (req, res) => {
  const productId = req.params.productId;
  try {
    const reviews = await reviewService.getAllReview(productId);
    return res.status(201).send(reviews);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export default {
  createReview,
  getAllReview,
};