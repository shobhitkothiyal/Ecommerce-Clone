import express from "express";
const router = express.Router();
import blogController from "../controller/blog.controller.js";
import upload from "../middlewere/upload.js";// Reuse existing upload middleware

router.post("/create", upload.any(), blogController.createBlog);
router.get("/all", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/update/:id", upload.any(), blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

export default router;