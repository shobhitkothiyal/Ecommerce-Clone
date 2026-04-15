import express from "express";
import stockNotificationController from "../controller/stockNotification.controller.js";

const router = express.Router();

router.post("/", stockNotificationController.createNotification);

export default router;
