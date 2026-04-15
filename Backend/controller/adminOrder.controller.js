import orderService from "../services/order.service.js";

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders(req.query);
    return res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const confirmedOrder = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await orderService.confirmedOrder(orderId);
    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const shipOrder = async (req, res) => {
  const orderId = req.params.orderId; // Action.js uses /:orderId
  try {
    const order = await orderService.shipOrder(orderId);
    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deliverOrder = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await orderService.deliverOrder(orderId);
    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const cancelledOrder = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await orderService.cancelledOrder(orderId);
    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const outForDelivery = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await orderService.outForDeliveryOrder(orderId);
    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    await orderService.deleteOrder(orderId);
    return res
      .status(200)
      .send({ message: "Order deleted successfully", status: true });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const approveReturn = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await orderService.approveReturn(orderId, req.body);
    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Add outForDelivery and other statuses if service supports them,
// for now service has confirmed, ship, deliver, cancel.
// User wants "Out For Delivery" too based on logs/Action.js.
// Inspecting order.service.js again, it lacks 'outForDelivery' function.
// I will implement it in service later. For now, map existing ones.

const getUsersOrders = async (req, res) => {
  const userId = req.params.userId;
  try {
    const orders = await orderService.usersOrderHistory(userId);
    return res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getDashboardOverview = async (req, res) => {
  try {
    const overviewData = await orderService.getDashboardOverview();
    return res.status(200).send({ data: overviewData });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export default {
  getAllOrders,
  confirmedOrder,
  shipOrder,
  deliverOrder,
  cancelledOrder,
  approveReturn,
  deleteOrder,
  outForDelivery,
  getUsersOrders,
  getDashboardOverview,
};