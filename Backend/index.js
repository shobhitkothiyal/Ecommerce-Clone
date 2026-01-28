import express from "express";
import { DBConnect } from "./config/db.config.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL2],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

await DBConnect();

/*  {Auth Routes}  */
import authRoutes from "./routes/auth.route.js";
app.use("/api", authRoutes);

import adminAuthRoutes from "./routes/adminAuth.route.js";
app.use("/api/admin/auth", adminAuthRoutes);

import userRoutes from "./routes/user.route.js";
app.use("/api/user", userRoutes);

import adminUserRoutes from "./routes/adminUser.route.js";
app.use("/api/users", adminUserRoutes);

import productRoutes from "./routes/product.route.js";
app.use("/api/products", productRoutes);

import adminProductRoutes from "./routes/adminProduct.route.js";
app.use("/api/admin/products", adminProductRoutes);

import reviewRoutes from "./routes/review.route.js";
app.use("/api/reviews", reviewRoutes);

import cartRoutes from "./routes/cart.route.js";
app.use("/api/cart", cartRoutes);

import paymentRoutes from "./routes/payment.route.js";
app.use("/api/payments", paymentRoutes);

import orderRoutes from "./routes/order.route.js";
app.use("/api/orders", orderRoutes);

import adminOrderRoutes from "./routes/adminOrder.route.js";
app.use("/api/admin/orders", adminOrderRoutes);

import queryRoutes from "./routes/query.route.js";
app.use("/api/queries", queryRoutes);

import blogRoutes from "./routes/blog.route.js";
app.use("/api/blogs", blogRoutes);

import couponRoutes from "./routes/coupon.route.js";
app.use("/api/coupons", couponRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Globar Error Handler:", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});