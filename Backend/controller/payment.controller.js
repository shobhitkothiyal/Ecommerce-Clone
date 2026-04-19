import Razorpay from "razorpay";
import orderService from "../services/order.service.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPaymentLink = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Validate amount
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    // Validate Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay credentials not configured");
      return res.status(500).json({ error: "Payment gateway not configured" });
    }

    const options = {
      amount: Math.round(amount * 100), // convert to paise and ensure integer
      currency: currency || "INR",
      receipt: "receipt#" + Date.now(),
    };

    console.log("Creating Razorpay order with options:", options);

    try {
      const order = await razorpay.orders.create(options);
      console.log("Razorpay order created successfully:", order.id);
      res.status(200).json(order);
    } catch (razorpayError) {
      console.error("Razorpay API error details:", {
        message: razorpayError.message,
        response: razorpayError.response,
        statusCode: razorpayError.statusCode,
        fullError: razorpayError
      });
      return res.status(500).json({ 
        error: "Payment gateway error: " + (razorpayError.message || "Unknown error") 
      });
    }
  } catch (err) {
    console.error("Error creating payment order:", {
      message: err.message,
      stack: err.stack
    });
    res.status(500).send({ error: err.message });
  }
};

const updatePaymentInformation = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      shippingAddress,
    } = req.body;

    console.log("Payment verification request received:", {
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      signature: razorpay_signature ? "***" : "missing",
      user: req.user._id
    });

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      console.error("Missing payment details");
      return res.status(400).json({ 
        success: false, 
        message: "Missing payment details" 
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    console.log("Signature verification:", {
      provided: razorpay_signature,
      expected: expectedSign,
      match: razorpay_signature === expectedSign
    });

    const verified = razorpay_signature === expectedSign;

    if (verified) {
      console.log("Payment verified successfully");
      const user = req.user;

      const order = await orderService.createOrder(user, shippingAddress);

      order.paymentDetails.paymentId = razorpay_payment_id;
      order.paymentDetails.razorpayOrderId = razorpay_order_id;
      order.paymentDetails.razorpayPaymentId = razorpay_payment_id;
      order.paymentDetails.razorpaySignature = razorpay_signature;
      order.paymentDetails.paymentStatus = "COMPLETED";
      order.paymentDetails.paymentMethod = "Razorpay";
      order.orderStatus = "PLACED";

      await order.save();

      console.log("Order created:", order._id);

      res.status(200).json({
        success: true,
        message: "Payment verified and Order Placed",
        order,
      });
    } else {
      console.error("Signature verification failed");
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (err) {
    console.error("Error updating payment information:", err.message);
    res.status(500).send({ error: err.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orderId = req.query.orderId;

    let orders = await orderService.usersOrderHistory(userId);

    if (orderId) {
      orders = orders.filter((o) => o._id.toString() === orderId);
    }

    const paymentHistory = orders.map((order) => ({
      _id: order._id, // Unique key
      paymentId:
        order.paymentDetails?.paymentId ||
        order.paymentDetails?.razorpayPaymentId ||
        "N/A",
      status: order.paymentDetails?.paymentStatus || "PENDING",
      amount: order.totalDiscountedPrice,
      order: order._id,
      paidAt: order.createdAt, // Approximating paid time to order creation
      userSnapshot: {
        firstName: order.shippingAddress?.firstName || order.user?.firstName,
        lastName: order.shippingAddress?.lastName || order.user?.lastName,
        email: order.user?.email,
      },
    }));

    res.status(200).json(paymentHistory);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export default {
  createPaymentLink,
  updatePaymentInformation,
  getPaymentHistory,
};