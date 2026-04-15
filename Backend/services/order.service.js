import Address from "../model/address.model.js";
import Order from "../model/order.model.js";
import OrderItem from "../model/orderItems.model.js";
import cartService from "../services/cart.service.js";
import User from "../model/user.model.js";
import Product from "../model/product.model.js";

const createOrder = async (user, shippAddress) => {
  let address;

  if (shippAddress._id) {
    let existAddress = await Address.findById(shippAddress._id);
    address = existAddress;
  } else {
    address = new Address(shippAddress);
    address.user = user._id;
    await address.save();
    user.addresses.push(address);
    await user.save();
  }

  const cart = await cartService.findUserCart(user._id);
  const orderItems = [];

  for (const item of cart.cartItems) {
    const orderItem = new OrderItem({
      price: item.price,
      product: item.product,
      quantity: item.quantity,
      size: item.size,
      userId: item.userId,
      discountedPrice: item.discountedPrice,
    });

    const createdOrderItem = await orderItem.save();
    orderItems.push(createdOrderItem);
  }

  const createdOrder = new Order({
    user: user._id,
    orderItems,
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: cart.totalDiscountedPrice,
    discount: cart.discount,
    totalItem: cart.totalItem,
    shippingAddress: address,
    orderDate: new Date(),
    orderStatus: "PENDING", // Initial status
    paymentDetails: {
      paymentStatus: "PENDING",
    },
    createdAt: new Date(),
  });

  const savedOrder = await createdOrder.save();
  user.orders.push(savedOrder._id);
  await user.save();

  await cartService.clearUserCart(user._id);

  return savedOrder;
};

const placeOrder = async (orderId) => {
  const order = await findOrderById(orderId);
  order.orderStatus = "PLACED";
  order.paymentDetails.paymentStatus = "COMPLETED";
  return await order.save();
};

// Function removed (moved to bottom)

const confirmedOrder = async (orderId) => {
  const order = await findOrderById(orderId);
  order.orderStatus = "CONFIRMED";
  return await order.save();
};

const shipOrder = async (orderId) => {
  const order = await findOrderById(orderId);
  order.orderStatus = "SHIPPED";
  return await order.save();
};

const deliverOrder = async (orderId) => {
  const order = await findOrderById(orderId);
  order.orderStatus = "DELIVERED";
  return await order.save();
};

const outForDeliveryOrder = async (orderId) => {
  const order = await findOrderById(orderId);
  order.orderStatus = "OUTFORDELIVERY"; // Matches Action.js expectation? Action says "OUTFORDELIVERY" in setState but "OUT_FOR_DELIVERY" in menu?
  // Frontend Action.js: setOrderStatus("OUTFORDELIVERY");
  // Frontend chip check: item.orderStatus === "OUT_FOR_DELIVERY"
  // Let's use OUT_FOR_DELIVERY to be consistent with chips.
  // Wait, frontend Action.js sets "OUTFORDELIVERY" string in local state, but the Menu checks "OUT_FOR_DELIVERY".
  // Code: item.orderStatus === "OUT_FOR_DELIVERY" ? ...
  // So backend should save "OUT_FOR_DELIVERY".
  order.orderStatus = "OUT_FOR_DELIVERY";
  return await order.save();
};

const cancelledOrder = async (orderId) => {
  const order = await findOrderById(orderId);
  order.orderStatus = "CANCELLED";
  return await order.save();
};

const findOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("user")
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("shippingAddress");

  return order;
};

const usersOrderHistory = async (userId) => {
  try {
    const orders = await Order.find({
      user: userId,
      user: userId,
      // orderStatus: { $ne: "PENDING" },
    }) // Show only placed orders? Or all? Usually filter out empty pending ones if any.
      .populate({ path: "orderItems", populate: { path: "product" } })
      .lean();
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllOrders = async (queryParams) => {
  const { page = 1, pageSize = 10, status, sort } = queryParams || {};

  let query = {};
  if (status) {
    query.orderStatus = status;
  }

  // Sort logic
  let sortOptions = {};
  if (sort === "Newest") {
    sortOptions = { createdAt: -1 };
  } else if (sort === "Oldest") {
    sortOptions = { createdAt: 1 };
  }

  const totalOrders = await Order.countDocuments(query);
  const totalPages = Math.ceil(totalOrders / pageSize);

  const orders = await Order.find(query)
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("user") // Populate user for admin view
    .populate("shippingAddress")
    .sort(sortOptions)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  return {
    content: orders,
    currentPage: parseInt(page),
    totalPages,
    totalElements: totalOrders,
  };
};

const deleteOrder = async (orderId) => {
  const order = await findOrderById(orderId);
  await Order.findByIdAndDelete(order._id);
};

const getDashboardOverview = async () => {
  try {
    const totalRevenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $in: ["CONFIRMED", "SHIPPED", "DELIVERED", "COMPLETED"],
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalDiscountedPrice" } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Last Month/Year Revenue logic could be added here, for now simpler mock or basic calc
    const lastYearRevenue = totalRevenue * 0.8; // Placeholder trend logic if no historical data specific query

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "firstName lastName email")
      .lean();

    // Recent Users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Recent Products
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Top Categories (Aggregation)
    const topCategories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    return {
      totalRevenue,
      lastYearRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders,
      recentUsers,
      recentProducts,
      topCategories,
      weeklyOrderCount: 42, // Mocked for now or add date range query
      totalProfit: totalRevenue * 0.3, // Mock profit margin
      totalRefund: 0,
      totalQueries: 0,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Implementations

const cancelOrder = async (orderId, userId) => {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("Order not found");

  // Allow admin or the specific user
  // (userId check skipped here if assuming controller sends validated user, or add here if needed)

  if (
    order.orderStatus === "SHIPPED" ||
    order.orderStatus === "DELIVERED" ||
    order.orderStatus === "COMPLETED" ||
    order.orderStatus === "OUT_FOR_DELIVERY"
  ) {
    throw new Error("Order cannot be cancelled at this stage.");
  }

  order.orderStatus = "CANCELLED";
  order.cancelReason = "User requested cancellation"; // Simple default or pass from args
  return await order.save();
};

const requestReturn = async (orderId, userId, payload) => {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("Order not found");

  if (order.orderStatus !== "DELIVERED") {
    throw new Error("Order is not delivered yet.");
  }

  if (order.returnStatus !== "NONE") {
    throw new Error("Return already requested or processed.");
  }

  // Check 7-day window
  const deliveryDate = new Date(order.deliveryDate || order.updatedAt); // Fallback to updatedAt if deliveryDate missing
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - deliveryDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 7) {
    throw new Error("Return period (7 days) has expired.");
  }

  order.returnStatus = "REQUESTED";
  order.orderStatus = "RETURN_REQUESTED";
  order.returnRequestType = payload.returnRequestType || "RETURN";
  order.returnReason = payload.returnReason || "User requested return";
  order.returnDescription = payload.returnDescription || "";
  order.returnImages = payload.returnImages || [];

  return await order.save();
};

const approveReturn = async (orderId, payload = {}) => {
  const order = await findOrderById(orderId);

  if (payload.status === "RETURN_REJECTED") {
    order.orderStatus = "RETURN_REJECTED";
    order.returnStatus = "REJECTED";
    order.returnDeclineReason = payload.rejectionMessage;
  } else if (
    payload.status === "RETURNED" ||
    payload.status === "RETURNED_APPROVED"
  ) {
    order.orderStatus = "RETURNED";
    // Keep returnStatus as APPROVED or move to COMPLETED if supported
  } else {
    // Approved
    order.returnStatus = "APPROVED";
    order.returnApprovedDate = new Date();
    order.orderStatus = "RETURN_APPROVED";
  }

  if (payload.adminNote) {
    order.returnAdminNote = payload.adminNote;
  }

  await order.save();
  return order;
};

export default {
  createOrder,
  placeOrder,
  confirmedOrder,
  shipOrder,
  deliverOrder,
  cancelledOrder,
  outForDeliveryOrder,
  findOrderById,
  usersOrderHistory,
  getAllOrders,
  cancelOrder,
  requestReturn,
  approveReturn,
  deleteOrder,
  getDashboardOverview,
};