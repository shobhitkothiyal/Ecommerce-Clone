import express from "express";
const router = express.Router();
import adminOrderController from "../controller/adminOrder.controller.js";
import authenticate from "../middlewere/authenticate.js";

router.get(
  "/overview",
  authenticate,
  adminOrderController.getDashboardOverview
);
router.get("/", authenticate, adminOrderController.getAllOrders);
router.get("/user/:userId", authenticate, adminOrderController.getUsersOrders);
router.put(
  "/:orderId/confirmed",
  authenticate,
  adminOrderController.confirmedOrder
);
router.put("/:orderId/ship", authenticate, adminOrderController.shipOrder);
router.put(
  "/:orderId/deliver",
  authenticate,
  adminOrderController.deliverOrder
);
router.put(
  "/:orderId/cancel",
  authenticate,
  adminOrderController.cancelledOrder
);
router.put(
  "/:orderId/out-for-delivery",
  authenticate,
  adminOrderController.outForDelivery
);
router.delete(
  "/:orderId/delete",
  authenticate,
  adminOrderController.deleteOrder
);
router.put(
  "/:orderId/return",
  authenticate,
  adminOrderController.cancelledOrder
); // Reusing/Fixing return logic if needed, Action.js calls /return

export default router;