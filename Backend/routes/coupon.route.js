import express from "express";
const router = express.Router();
import couponController from "../controller/coupon.controller.js";
import authenticate from "../middlewere/authenticate.js";

// Admin routes for coupon management
router.post("/create", authenticate, couponController.createCoupon);
router.get("/all_coupon", authenticate, couponController.getAllCoupons);
router.delete("/delete/:id", authenticate, couponController.deleteCoupon);
router.put("/update/:id", authenticate, couponController.updateCoupon);

export default router;