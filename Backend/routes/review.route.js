import express from "express";
import reviewController from "../controller/review.controller.js";
import authenticate from "../middlewere/authenticate.js";

const router = express.Router();

router.post("/create", authenticate, reviewController.createReview);
router.get("/product/:productId", reviewController.getAllReview);

export default router;