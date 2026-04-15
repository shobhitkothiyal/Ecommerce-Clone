import express from "express";
import reviewController from "../controller/review.controller.js";
import authenticate from "../middlewere/authenticate.js";

import upload from "../middlewere/upload.js";

const router = express.Router();

router.post(
  "/create",
  authenticate,
  upload.array("images"),
  reviewController.createReview,
);
router.get("/product/:productId", reviewController.getAllReview);

export default router;