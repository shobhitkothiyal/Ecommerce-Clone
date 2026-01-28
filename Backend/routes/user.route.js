import express from "express";
import * as userController from "../controller/user.controller.js";
import authenticate from "../middlewere/authenticate.js";

const router = express.Router();

router.post("/addresses", authenticate, userController.addAddress);
router.get("/addresses", authenticate, userController.getUserAddresses);
router.delete(
  "/addresses/:addressId",
  authenticate,
  userController.removeAddress
);
router.put("/addresses/:addressId", authenticate, userController.editAddress);

router.put("/wishlist/add", authenticate, userController.addToWishlist);
router.put("/wishlist/remove", authenticate, userController.removeFromWishlist);
router.get("/wishlist", authenticate, userController.getWishlist);
router.get("/profile", authenticate, userController.getUserProfile);

export default router;