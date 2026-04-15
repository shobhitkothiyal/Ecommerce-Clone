import express from "express";
import * as adminAuthController from "../controller/adminAuth.controller.js";
import authenticate from "../middlewere/authenticate.js";

const router = express.Router();

router.post("/login", adminAuthController.login);
router.get("/profile", authenticate, adminAuthController.getProfile);

export default router;