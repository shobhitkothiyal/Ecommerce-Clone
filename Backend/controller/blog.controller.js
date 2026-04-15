import Blog from "../model/blog.model.js";

const createBlog = async (req, res) => {
  try {
    const { title, author, content, summary } = req.body;
    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.path);
    }

    const newBlog = new Blog({
      title,
      author,
      content,
      summary,
      images,
    });

    const savedBlog = await newBlog.save();
    return res.status(201).send(savedBlog);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    // Front end expects: { data: [], pagination: { totalPages: 1 } }
    return res.status(200).send({
      data: blogs,
      pagination: {
        totalPages,
        currentPage: page,
        totalBlogs,
      },
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }
    return res.status(200).send(blog);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { title, author, content, summary, existingImages } = req.body;
    let images = [];

    // Parse existing images if passed as string (from JSON.stringify on frontend)
    if (existingImages) {
      try {
        images = JSON.parse(existingImages);
      } catch (e) {
        images = [];
      }
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      images = [...images, ...newImages];
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, author, content, summary, images },
      { new: true }
    );

    return res.status(200).send(updatedBlog);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    return res.status(200).send({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export default {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};