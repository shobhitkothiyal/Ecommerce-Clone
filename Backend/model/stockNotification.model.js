import mongoose from "mongoose";

const stockNotificationSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  variantColor: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "NOTIFIED"],
    default: "PENDING",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const StockNotification = mongoose.model("stockNotifications", stockNotificationSchema);

export default StockNotification;
