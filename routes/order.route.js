import express from "express";
const router = express.Router();
import orderController from "../controller/order.controller.js";
import authenticate from "../middlewere/authenticate.js";
import upload from "../middlewere/upload.js";

router.get("/user", authenticate, orderController.findUserOrders);
router.get("/:id", authenticate, orderController.findOrderById);
router.put("/:id/cancel", authenticate, orderController.cancelOrder);
router.put(
  "/:id/return",
  authenticate,
  upload.array("returnImages"),
  orderController.requestReturn,
);

export default router;