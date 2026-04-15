import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: false,
  },
  images: [
    {
      type: String, // Determine if storing URL or object. Product uses 'images' array of strings.
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model("blogs", blogSchema);

export default Blog;