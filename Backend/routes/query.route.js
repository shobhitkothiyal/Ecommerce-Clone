import express from "express";
const router = express.Router();
import queryController from "../controller/query.controller.js";
import authenticate from "../middlewere/authenticate.js";

// Public Route
router.post("/", queryController.createQuery);

// Admin Routes (Protected)
router.get("/", authenticate, queryController.getAllQueries);
router.put("/:queryId/status", authenticate, queryController.updateQueryStatus);
router.delete("/:queryId", authenticate, queryController.deleteQuery);

export default router;