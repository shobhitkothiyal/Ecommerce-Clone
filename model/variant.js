import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
  {
    color: { type: String, required: true }, // "Red & Green"
    hex: { type: String, default: "" }, // single color only
    colors: { type: [String], default: [] }, // dual colors ["#ff0000", "#00ff00"]

    sizes: [
      {
        size: String,
        stock: Number,
        price: Number,
      },
    ],
  },
  { _id: false }
);

export default VariantSchema;
