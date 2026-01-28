import express from "express";
import * as userController from "../controller/user.controller.js";
import authenticate from "../middlewere/authenticate.js";

const router = express.Router();

router.get("/", authenticate, userController.getAllUsers);

export default router;