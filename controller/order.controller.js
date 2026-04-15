import orderService from "../services/order.service.js";

const findUserOrders = async (req, res) => {
  try {
    const user = req.user;
    const orders = await orderService.usersOrderHistory(user._id);
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    const order = await orderService.findOrderById(req.params.id);
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  // This might be used if we support Cash on Delivery or non-payment flows.
  try {
    const user = req.user;
    const savedOrder = await orderService.createOrder(user, req.body);
    res.status(201).send(savedOrder);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user._id);
    res.status(200).send(order);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const requestReturn = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.files && req.files.length > 0) {
      payload.returnImages = req.files.map((file) => file.path);
    }
    const order = await orderService.requestReturn(
      req.params.id,
      req.user._id,
      payload,
    );
    res.status(200).send(order);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export default {
  findUserOrders,
  findOrderById,
  createOrder,
  cancelOrder,
  requestReturn,
};