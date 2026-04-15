import StockNotification from "../model/stockNotification.model.js";

const createNotification = async (data) => {
  try {
    // Check if a notification already exists for this email, product, color, and size
    const existingNotification = await StockNotification.findOne({
      product: data.productId,
      variantColor: data.color,
      size: data.size,
      email: data.email,
    });

    if (existingNotification) {
      throw new Error("You are already signed up for this notification.");
    }

    const notification = new StockNotification({
      product: data.productId,
      variantColor: data.color,
      size: data.size,
      email: data.email,
    });

    return await notification.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

export default { createNotification };
