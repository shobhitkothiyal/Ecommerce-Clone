import express from "express";
const router = express.Router();
import orderController from "../controller/order.controller.js";
import authenticate from "../middlewere/authenticate.js";

router.get("/user", authenticate, orderController.findUserOrders);
router.get("/:id", authenticate, orderController.findOrderById);
// router.post("/", authenticate, orderController.createOrder); // If needed

export default router;