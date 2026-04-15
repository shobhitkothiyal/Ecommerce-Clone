import stockNotificationService from "../services/stockNotification.service.js";

const createNotification = async (req, res) => {
  try {
    const notification = await stockNotificationService.createNotification(req.body);
    res.status(201).json({
      success: true,
      message: "Notification signed up successfully!",
      notification,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export default { createNotification };
