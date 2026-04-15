import mongoose from "mongoose";
import dotenv from "dotenv";
import { DBConnect } from "../config/db.config.js";
import User from "../model/user.model.js";
import Order from "../model/order.model.js";

dotenv.config();

const fixOrderReferences = async () => {
  try {
    await DBConnect();

    const users = await User.find({});
    console.log(`Found ${users.length} users. Checking orders...`);

    for (const user of users) {
      const orders = await Order.find({ user: user._id });

      if (orders.length > 0) {
        const orderIds = orders.map((order) => order._id);

        // Update user orders array
        user.orders = orderIds;
        await user.save();

        console.log(
          `Updated user ${user.email}: Linked ${orders.length} orders.`
        );
      } else {
        console.log(`User ${user.email}: No orders found.`);
      }
    }

    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

fixOrderReferences();