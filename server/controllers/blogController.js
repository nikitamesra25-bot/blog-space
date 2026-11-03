const Blog = require("../models/Blog");

const createBlog = async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }

    const blog = await Blog.create({
      title,
      content,
      imageUrl: imageUrl || "",
      author: req.user._id
    });

    return res.status(201).json({
      message: "Blog created successfully",
      blog
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: blogs.length,
      blogs
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email");

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    return res.status(200).json({ blog });

  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch blog"
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to edit this blog"
      });
    }

    blog.title = title.trim();
    blog.content = content;
    blog.imageUrl = imageUrl || "";

    await blog.save();

    return res.status(200).json({
      message: "Blog updated successfully",
      blog
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this blog"
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Blog deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog
};
