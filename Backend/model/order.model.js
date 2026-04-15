import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orderItems",
    },
  ],
  orderDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
  },
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "addresses",
  },
  paymentDetails: {
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    paymentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      default: "PENDING",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  totalDiscountedPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "PENDING",
  },
  // New fields for Cancel/Return feature
  returnStatus: {
    type: String,
    enum: ["NONE", "REQUESTED", "APPROVED", "REJECTED", "COMPLETED"],
    default: "NONE",
  },
  returnRequestType: {
    type: String,
    enum: ["RETURN", "EXCHANGE"],
    default: "RETURN",
  },
  returnReason: {
    type: String,
    default: null,
  },
  returnDescription: {
    type: String,
    default: null,
  },
  returnImages: [
    {
      type: String,
    },
  ],
  returnAdminNote: String,
  returnDeclineReason: String,
  returnApprovedDate: Date,
  cancelReason: {
    type: String,
    default: null,
  },
  totalItem: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("orders", orderSchema);

export default Order;