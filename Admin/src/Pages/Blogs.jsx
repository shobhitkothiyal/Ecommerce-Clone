import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import {
  Button,
  CardHeader,
  IconButton,
  Pagination,
  Modal,
  TextField,
  Backdrop,
  Avatar,
  AvatarGroup,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Edit, Trash2, Plus, X, Upload, ImageIcon } from "lucide-react";
import axios from "axios";
// import { API_BASE_URL } from "../Config/api";
// Assuming API_BASE_URL is usually imported or we can use env.
const API_BASE_URL = import.meta.env.VITE_React_BASE_API_URL;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    author: "",
    title: "",
    summary: "",
    content: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 10;

  // Fetch blogs from API
  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/blogs/all?page=${page}&limit=${itemsPerPage}`
      );
      setBlogs(response.data.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const handlePaginationChange = (event, value) => {
    setPage(value);
  };

  const handleCreateBlog = () => {
    setEditingBlog(null);
    setFormData({ author: "", title: "", summary: "", content: "" });
    setSelectedImages([]);
    setImagePreviews([]);
    setExistingImages([]);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingBlog(null);
    setFormData({ author: "", title: "", summary: "", content: "" });
    setSelectedImages([]);
    setImagePreviews([]);
    setExistingImages([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check max 4 images limit
    const totalImages =
      existingImages.length + imagePreviews.length + files.length;
    if (totalImages > 4) {
      alert("Maximum 4 images allowed");
      return;
    }

    // Add new files to existing selection
    setSelectedImages((prev) => [...prev, ...files]);

    // Create preview URLs for new files
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setSelectedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );

    if (
      imagePreviews[indexToRemove] &&
      imagePreviews[indexToRemove].startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreviews[indexToRemove]);
    }

    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("author", formData.author);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("summary", formData.summary);
      formDataToSend.append("content", formData.content);

      // Add existing images as JSON string
      formDataToSend.append("existingImages", JSON.stringify(existingImages));

      // Add new image files
      selectedImages.forEach((file) => {
        formDataToSend.append("images", file);
      });

      if (editingBlog) {
        // Update existing blog
        await axios.put(
          `${API_BASE_URL}/api/blogs/update/${editingBlog._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Blog updated successfully");
      } else {
        // Create new blog
        await axios.post(`${API_BASE_URL}/api/blogs/create`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Blog created successfully");
      }

      handleCloseModal();
      fetchBlogs(); // Refresh the list
    } catch (error) {
      console.error("Error saving blog:", error);
      alert(error.response?.data?.message || "Error saving blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (blogId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blogs/${blogId}`);
      const blogToEdit = response.data;

      setEditingBlog(blogToEdit);
      setFormData({
        author: blogToEdit.author || "",
        title: blogToEdit.title || "",
        summary: blogToEdit.summary || "",
        content: blogToEdit.content || "",
      });
      setExistingImages(blogToEdit.images || []);
      setImagePreviews([]);
      setSelectedImages([]);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching blog:", error);
      alert("Error loading blog details");
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (blog) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setBlogToDelete(null);
  };

  // Confirm and perform delete
  const confirmDelete = async () => {
    if (!blogToDelete) return;

    setIsDeleting(true);
    try {
      // Corrected delete URL structure
      await axios.delete(`${API_BASE_URL}/api/blogs/${blogToDelete._id}`);
      console.log("Blog deleted successfully");
      fetchBlogs(); // Refresh the list
      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert(error.response?.data?.message || "Error deleting blog");
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate display index
  const startIndex = (page - 1) * itemsPerPage;

  return (
    <Box className="bg-black min-h-screen p-4 text-white">
      <Card
        sx={{ bgcolor: "#18181b", color: "white", border: "1px solid #27272a" }}
      >
        <CardHeader
          title="All Blogs"
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
            "& .MuiCardHeader-title": { color: "white", fontWeight: "bold" },
          }}
          action={
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={handleCreateBlog}
              sx={{
                backgroundColor: "#6366f1", // Indigo 500
                "&:hover": {
                  backgroundColor: "#4f46e5", // Indigo 600
                },
                textTransform: "none",
                fontWeight: 600,
                color: "white",
              }}
            >
              Create Blog
            </Button>
          }
        />
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="blogs table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "white" }}>
                  S.No
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: "white" }}
                  align="center"
                >
                  Images
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "white" }}>
                  Author
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "white" }}>
                  Title
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, minWidth: 200, color: "white" }}
                >
                  Summary
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, minWidth: 200, color: "white" }}
                >
                  Content
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: "white" }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ color: "white" }}>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{ textAlign: "center", py: 5, color: "white" }}
                  >
                    <CircularProgress size={40} sx={{ color: "indigo.500" }} />
                  </TableCell>
                </TableRow>
              ) : blogs.length > 0 ? (
                blogs.map((blog, index) => (
                  <TableRow
                    hover
                    key={blog._id}
                    sx={{
                      "&:last-of-type td, &:last-of-type th": { border: 0 },
                      "&:hover": { backgroundColor: "#27272a !important" },
                    }}
                  >
                    <TableCell sx={{ color: "white" }}>
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell align="center">
                      {blog.images && blog.images.length > 0 ? (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <AvatarGroup max={3}>
                            {blog.images.map((img, idx) => (
                              <Avatar
                                key={idx}
                                src={img}
                                variant="rounded"
                                sx={{ width: 40, height: 40 }}
                              />
                            ))}
                          </AvatarGroup>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            backgroundColor: "#333",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                          }}
                        >
                          <ImageIcon size={20} color="#999" />
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 100, color: "white" }}>
                      <Typography noWrap>{blog.author}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 150, color: "white" }}>
                      <Typography noWrap sx={{ fontWeight: 500 }}>
                        {blog.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 150, color: "white" }}>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {blog.summary}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 180, color: "white" }}>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          fontStyle: "italic",
                        }}
                      >
                        {blog.content}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleEdit(blog._id)}
                        sx={{ color: "#818cf8" }}
                      >
                        <Edit size={18} />
                      </IconButton>
                      <IconButton
                        onClick={() => openDeleteDialog(blog)}
                        sx={{ color: "#f87171" }}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 3 }}>
                    <Typography variant="body2" color="gray.500">
                      No blogs found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Card
        className="mt-2 text-center"
        sx={{ bgcolor: "#18181b", color: "white", border: "1px solid #27272a" }}
      >
        <Pagination
          className="py-5 w-auto inline-block"
          size="large"
          count={totalPages}
          page={page}
          color="primary"
          onChange={handlePaginationChange}
          sx={{
            button: { color: "white" },
            ".Mui-selected": {
              bgcolor: "indigo.600 !important",
              color: "white",
            },
            ".MuiPaginationItem-ellipsis": { color: "white" },
          }}
        />
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        PaperProps={{
          sx: {
            backgroundColor: "#18181b",
            color: "white",
            border: "1px solid rgba(255,255,255,0.1)",
            minWidth: "300px",
          },
        }}
      >
        <DialogTitle sx={{ color: "white" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "white" }}>
            Are you sure you want to delete this blog? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} sx={{ color: "white" }}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Blog Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(5px)",
            },
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600 },
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: "#18181b", // Dark modal background
            color: "white",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            border: "1px solid #3f3f46",
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, color: "white" }}>
              {editingBlog ? "Edit Blog" : "Create New Blog"}
            </Typography>
            <IconButton onClick={handleCloseModal} sx={{ color: "gray.400" }}>
              <X size={24} />
            </IconButton>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {["author", "title", "summary", "content"].map((field) => (
                <TextField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  multiline={field === "summary" || field === "content"}
                  rows={field === "summary" ? 2 : field === "content" ? 6 : 1}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "#3f3f46" },
                      "&:hover fieldset": { borderColor: "gray.400" },
                      "&.Mui-focused fieldset": { borderColor: "indigo.500" },
                    },
                    "& .MuiInputLabel-root": { color: "gray.400" },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "indigo.500",
                    },
                  }}
                />
              ))}

              {/* Image Upload Section - unchanged */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: 600, color: "gray.300" }}
                >
                  Blog Images (Max 4)
                </Typography>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "gray.500", mb: 1, display: "block" }}
                    >
                      Current Images:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                      {existingImages.map((img, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: "relative",
                            width: 80,
                            height: 80,
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid #333",
                          }}
                        >
                          <img
                            src={img}
                            alt={`Existing ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveExistingImage(index)}
                            sx={{
                              position: "absolute",
                              top: 2,
                              right: 2,
                              backgroundColor: "rgba(0,0,0,0.6)",
                              color: "#fff",
                              padding: "2px",
                              "&:hover": {
                                backgroundColor: "rgba(255,0,0,0.7)",
                              },
                            }}
                          >
                            <X size={14} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Upload Area */}
                {existingImages.length + imagePreviews.length < 4 && (
                  <Box
                    component="label"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #3f3f46",
                      borderRadius: 2,
                      p: 3,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "indigo.500",
                        backgroundColor: "rgba(99, 102, 241, 0.05)",
                      },
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                    <Upload size={32} color="#6366f1" />
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: "gray.400", textAlign: "center" }}
                    >
                      Click to upload images
                    </Typography>
                  </Box>
                )}

                {/* New Image Previews */}
                {imagePreviews.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "gray.500", mb: 1, display: "block" }}
                    >
                      New Images:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                      {imagePreviews.map((preview, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: "relative",
                            width: 80,
                            height: 80,
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid #333",
                          }}
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveNewImage(index)}
                            sx={{
                              position: "absolute",
                              top: 2,
                              right: 2,
                              backgroundColor: "rgba(0,0,0,0.6)",
                              color: "#fff",
                              padding: "2px",
                              "&:hover": {
                                backgroundColor: "rgba(255,0,0,0.7)",
                              },
                            }}
                          >
                            <X size={14} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  backgroundColor: "indigo.600",
                  "&:hover": { backgroundColor: "indigo.700" },
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : editingBlog ? (
                  "Update Blog"
                ) : (
                  "Create Blog"
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default Blogs;