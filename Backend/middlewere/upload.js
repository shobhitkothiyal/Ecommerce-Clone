import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js"; // Import configured cloudinary instance

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // folder: "uptownie_products", // Optional: separate folder in cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp", "avif"],
  },
});

const upload = multer({ storage: storage });

export default upload;