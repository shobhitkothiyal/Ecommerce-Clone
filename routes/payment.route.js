import express from "express";
const router = express.Router();
import paymentController from "../controller/payment.controller.js";
import authenticate from "../middlewere/authenticate.js";

router.post("/create-order", authenticate, paymentController.createPaymentLink);
router.post(
  "/verify-payment",
  authenticate,
  paymentController.updatePaymentInformation
);
router.get(
  "/payment-history/:userId",
  authenticate,
  paymentController.getPaymentHistory
);

export default router;