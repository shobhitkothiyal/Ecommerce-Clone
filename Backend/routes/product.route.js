import express from "express";
import productController from "../controller/product.controller.js";
import authenticate from "../middlewere/authenticate.js";
import upload from "../middlewere/upload.js"

const router = express.Router();

router.post("/", authenticate, upload.any(), productController.createProduct);
router.post("/creates", authenticate, productController.createMultipleProducts);
router.delete("/:id", authenticate, productController.deleteProduct);
router.put("/:id", authenticate, upload.any(), productController.updateProduct);
router.get("/:id", productController.findProductById);
router.get("/", productController.getAllProducts);

export default router;