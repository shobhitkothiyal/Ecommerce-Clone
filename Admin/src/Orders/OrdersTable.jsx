import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { MdClose } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmOrder,
  deleteOrder,
  deliveredOrder,
  getOrders,
  shipOrder,
  outForDeliveryOrder,
  returnedOrder,
  requestReturn,
} from "../Redux/Admin/Orders/Action";
import { motion } from "framer-motion";

import { getPaymentHistory } from "../Redux/Customers/Payment/Action";

const OrdersTable = () => {
  const baseUrl = import.meta.env.VITE_React_BASE_API_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ status: "", sort: "" });
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector((store) => store.payment); // from your combined reducer

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { adminsOrder } = useSelector((store) => store);
  const { orders, totalPages, currentPage } = adminsOrder;
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [anchorElArray, setAnchorElArray] = useState([]);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnMessage, setReturnMessage] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  const [returnTime, setReturnTime] = useState(""); // In days
  const [isReturnAccepted, setIsReturnAccepted] = useState(true);
  const [adminNotes, setAdminNotes] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const handleViewPaymentHistory = (order) => {
    setSelectedOrder(order);
    dispatch(getPaymentHistory(order.user._id, order._id));
    setShowPaymentModal(true);
  };

  function handlePaginationChange(event, value) {
    setPage(value);
  }

  const handleOpenOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true); // open modal
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setShowOrderModal(false); // close modal
  };

  useEffect(() => {
    dispatch(
      getOrders({
        page,
        pageSize: 10,
        status: formData.status,
        sort: formData.sort,
      })
    );
  }, [
    page,
    formData.status,
    formData.sort,
    adminsOrder.delivered,
    adminsOrder.shipped,
    adminsOrder.confirmed,
    adminsOrder.returned,
  ]);

  const handleUpdateStatusMenuClick = (event, index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorElArray(newAnchorElArray);
  };
  const handleUpdateStatusMenuClose = (index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = null;
    setAnchorElArray(newAnchorElArray);
  };
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value });
  };
  const handleConfirmedOrder = async (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    setUpdatingOrderId(orderId);
    await dispatch(confirmOrder(orderId));
    setOrderStatus("CONFIRMED");
    setUpdatingOrderId(null);
  };
  const handleShippedOrder = async (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    setUpdatingOrderId(orderId);
    await dispatch(shipOrder(orderId));
    setOrderStatus("ShIPPED");
    setUpdatingOrderId(null);
  };
  const handleOutForDeliveryOrder = async (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    setUpdatingOrderId(orderId);
    await dispatch(outForDeliveryOrder(orderId));
    setOrderStatus("OUTFORDELIVERY");
    setUpdatingOrderId(null);
  };
  const handleDeliveredOrder = async (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    setUpdatingOrderId(orderId);
    await dispatch(deliveredOrder(orderId));
    setOrderStatus("DELIVERED");
    setUpdatingOrderId(null);
  };

  const handleReturnOrder = async (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    setUpdatingOrderId(orderId);
    await dispatch(requestReturn(orderId));
    setOrderStatus("RETURNED_REQUESTED");
    setUpdatingOrderId(null);
  };

  const handleReturnedOrder = async (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    setUpdatingOrderId(orderId);
    const payload = {
      orderId,
      status: "RETURNED_APPROVED",
      adminNote: "Manually marked as returned by admin",
    };
    await dispatch(returnedOrder(payload));
    setOrderStatus("RETURNED");
    setUpdatingOrderId(null);
  };

  const handleDeleteOrder = (orderId) => {
    handleUpdateStatusMenuClose();
    setDeleteOrderId(orderId);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setDeleteOrderId(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteOrderId) {
      setUpdatingOrderId(deleteOrderId);
      await dispatch(deleteOrder(deleteOrderId));
      setUpdatingOrderId(null);
    }
    handleCloseDeleteModal();
  };
  const paidOrders = adminsOrder?.orders || [];

  useEffect(() => {
    if (selectedOrder || showPaymentModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => (document.body.style.overflow = "auto");
  }, [selectedOrder, showPaymentModal]);

  const handleOpenReturnModal = (order) => {
    setSelectedOrder(order);
    setShowReturnModal(true);
  };

  const handleSubmitReturnDecision = () => {
    const payload = {
      orderId: selectedOrder._id,
      status: isReturnAccepted ? "RETURN_APPROVED" : "RETURN_REJECTED",
      adminNote: adminNotes.trim(), // ✅ Send full custom note
      ...(isReturnAccepted && { returnTime }),
      ...(!isReturnAccepted && { rejectionMessage: returnMessage }),
    };

    dispatch(returnedOrder(payload)).then(() => {
      dispatch(getOrders({ page }));
      setShowReturnModal(false);
      setReturnTime("");
      setReturnMessage("");
      setAdminNotes(""); // Clear notes
    });
  };

  return (
    <div className="bg-black min-h-screen p-4 text-white">
      {selectedOrder && showOrderModal && (
        <div className="">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative backdrop-blur-md bg-zinc-900 border border-white text-white rounded-xl shadow-2xl"
            style={{
              position: "fixed",
              top: "10%",
              left: "30%",
              transform: "translate(-50%, -50%)",
              width: "95vw",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "24px",
              zIndex: 9999,
              borderRadius: "1rem",
              backgroundColor: "#18181b", // zinc-900
            }}
          >
            {/* Close Button */}
            <div className="p-6">
              <button
                onClick={handleCloseModal}
                className="absolute top-4! right-4! w-12! h-12! bg-white/10 text-white rounded-full text-2xl hover:text-red-500 shadow-lg flex items-center justify-center z-50 transition-colors hover:bg-white/20"
                style={{
                  top: "1rem",
                  right: "1rem",
                  width: "48px",
                  height: "48px",
                  borderRadius: "9999px",
                  position: "absolute",
                  zIndex: 9999,
                }}
              >
                <MdClose size={24} />
              </button>

              <h2 className="text-xl font-bold mb-4 text-white">
                Order Details
              </h2>
              <div className="space-y-2 mb-2 pb-4 text-white">
                <p>
                  <strong className="text-white">Order ID:</strong>{" "}
                  {selectedOrder._id}
                </p>
                <p>
                  <strong className="text-white">Status:</strong>{" "}
                  {selectedOrder.orderStatus}
                </p>
                <p>
                  <strong className="text-white">Date:</strong>{" "}
                  {new Date(selectedOrder.orderDate).toLocaleString()}
                </p>
                <p>
                  <strong className="text-white">Total Price:</strong> ₹
                  {selectedOrder.totalPrice}
                </p>
                <p>
                  <strong className="text-white">Discounted Price:</strong> ₹
                  {selectedOrder.totalDiscountedPrice}
                </p>
                <p>
                  <strong className="text-white">Payment ID:</strong>{" "}
                  {selectedOrder.paymentDetails?.paymentId}
                </p>
                <p>
                  <strong className="text-white">Payment Method:</strong>{" "}
                  {selectedOrder.paymentDetails?.paymentMethod || "Razorpay"}
                </p>
              </div>
              <hr className="my-4 border-gray-700" />
              {/* Shipping Info */}
              <h3 className="text-lg font-semibold text-white">
                Shipping Address
              </h3>
              {selectedOrder?.shippingAddress ? (
                <p className="text-gray-300">
                  {selectedOrder.shippingAddress.firstName}{" "}
                  {selectedOrder.shippingAddress.lastName},<br />
                  {selectedOrder.shippingAddress.mobile},<br />
                  {selectedOrder.shippingAddress.streetAddress},<br />
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.state},<br />
                  Pincode: {selectedOrder.shippingAddress.zipCode}
                </p>
              ) : (
                <p className="text-red-400 font-medium">
                  No shipping address available.
                </p>
              )}

              <hr className="my-4 border-gray-700" />
              {/* User Info */}
              <h3 className="text-lg font-semibold text-white">Customer</h3>
              <p className="text-gray-300">
                {selectedOrder.user.firstName} {selectedOrder.user.lastName}
              </p>
              <p className="text-gray-300">{selectedOrder.user.email}</p>
              <hr className="my-4 border-gray-700" />
              {/* Order Items */}
              <h3 className="text-lg font-semibold mb-2 text-white">Items</h3>
              <div className="grid gap-3">
                {selectedOrder.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 border-b border-gray-700 pb-2"
                  >
                    {/* Image wrapper */}
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        overflow: "hidden",
                        borderRadius: "6px",
                        flexShrink: 0,
                        backgroundColor: "#333",
                        border: "1px solid #444"
                      }}
                    >
                      <img
                        src={
                          (Array.isArray(item.product?.images) && item.product?.images.length > 0)
                            ? item.product?.images[0]
                            : (item.product?.variants?.[0]?.images?.[0] || item.product?.imageUrl?.[0] || item.product?.imageUrl)
                        }
                        alt={item.product?.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>

                    <div className="text-gray-300">
                      <p
                        style={{
                          fontWeight: "500",
                          fontSize: "14px",
                          color: "white",
                        }}
                      >
                        {item.product.title}
                      </p>
                      <p style={{ fontSize: "12px" }}>Qty: {item.quantity}</p>
                      <p style={{ fontSize: "12px" }}>Size: {item.size}</p>
                      <p style={{ fontSize: "12px" }}>
                        Price: ₹{item.discountedPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showPaymentModal && (
        <div className="">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative backdrop-blur-md bg-zinc-900 border border-white/10 text-white rounded-xl shadow-2xl"
            style={{
              position: "fixed",
              top: "40%",
              left: "30%",
              transform: "translate(-50%, -50%)",
              width: "95vw",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "24px",
              zIndex: 9999,
              borderRadius: "1rem",
              backgroundColor: "#18181b",
            }}
          >
            <button
              style={{
                top: "1rem",
                right: "1rem",
                width: "48px",
                height: "48px",
                borderRadius: "9999px",
                position: "absolute",
                zIndex: 9999,
              }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4! right-4! w-12! h-12! bg-white/10 text-white rounded-full text-2xl hover:text-red-500 shadow-lg flex items-center justify-center z-50 hover:bg-white/20 transition-colors"
            >
              <MdClose size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-white">
              Payment History
            </h2>

            {selectedOrder?.user && (
              <div className="mb-4 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                <p className="text-sm text-gray-300">
                  <strong className="text-white">Customer:</strong> {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                </p>
                <p className="text-sm text-gray-300">
                  <strong className="text-white">Email:</strong> {selectedOrder.user.email}
                </p>
              </div>
            )}

            {loading ? (
              <p className="text-center text-gray-400">Loading...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : history.length === 0 ? (
              <p className="text-center text-gray-400">
                No payment history found.
              </p>
            ) : (
              <ul className="space-y-2 max-h-75 overflow-y-auto text-gray-300">
                {history.map((payment) => (
                  <li
                    key={payment._id}
                    className="border-b border-gray-700 pb-2"
                  >
                    <p>
                      <strong className="text-white">Order ID:</strong>{" "}
                      {payment.order?._id || payment.order}
                    </p>
                    <p>
                      <strong className="text-white">Payment ID:</strong>{" "}
                      {payment.paymentId}
                    </p>
                    <p>
                      <strong className="text-white">Status:</strong>{" "}
                      {payment.status}
                    </p>
                    <p>
                      <strong className="text-white">Amount:</strong> ₹
                      {payment.amount}
                    </p>
                    <p>
                      <strong className="text-white">Paid At:</strong>{" "}
                      {new Date(payment.paidAt).toLocaleString()}
                    </p>

                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      )}

      {showReturnModal && selectedOrder && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            top: "5%",
            left: "25%",
            transform: "translate(-50%, -10%)",
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              width: "95vw",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              p: 3,
              borderRadius: 4,
              backgroundColor: "#18181b", // zinc-900
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: 8,
            }}
          >
            <Box
              sx={{
                backgroundColor: "#27272a", // zinc-800
                borderRadius: 3,
                p: 3,
                position: "relative",
              }}
            >
              <IconButton
                onClick={() => setShowReturnModal(false)}
                sx={{ position: "absolute", top: 8, right: 8, color: "gray" }}
              >
                <MdClose size={24} />
              </IconButton>

              <Typography variant="h6" sx={{ mb: 2, color: "white" }}>
                Handle Return Request
              </Typography>

              {/* Reason */}
              <Typography variant="body2" sx={{ mb: 1, color: "gray.300" }}>
                <strong style={{ color: "white" }}>
                  Reason from customer:
                </strong>{" "}
                {selectedOrder.returnReason}
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{ mb: 1, whiteSpace: "pre-wrap", color: "gray.300" }}
              >
                <strong style={{ color: "white" }}>Description:</strong>{" "}
                {selectedOrder.returnDescription}
              </Typography>

              {/* Uploaded Images */}
              {selectedOrder.returnImages &&
                selectedOrder.returnImages.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      fontWeight="medium"
                      sx={{ mb: 1, color: "white" }}
                    >
                      Submitted Images:
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "repeat(2, 1fr)",
                          sm: "repeat(3, 1fr)",
                        },
                        gap: 1,
                      }}
                    >
                      {selectedOrder.returnImages.map((url, idx) => (
                        <Box
                          key={idx}
                          component="img"
                          src={url}
                          alt={`Return Img ${idx}`}
                          sx={{
                            width: "100%",
                            height: 250,
                            objectFit: "cover",
                            borderRadius: 2,
                            border: "1px solid #444",
                            color: "white",
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

              {/* Decision */}
              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="medium" sx={{ mb: 1, color: "white" }}>
                  Return Decision:
                </Typography>
                <select
                  value={isReturnAccepted ? "accept" : "reject"}
                  onChange={(e) =>
                    setIsReturnAccepted(e.target.value === "accept")
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #444",
                    color: "white",
                    backgroundColor: "#3f3f46", // zinc-700
                  }}
                >
                  <option value="accept">Accept</option>
                  <option value="reject">Reject</option>
                </select>
              </Box>

              {/* Time or Rejection Message */}
              <Box sx={{ mb: 3, color: "white" }}>
                <Typography fontWeight="medium" sx={{ mb: 1 }}>
                  {isReturnAccepted
                    ? "Return Processing Time (in days)"
                    : "Rejection Message"}
                </Typography>
                <input
                  type="text"
                  placeholder={
                    isReturnAccepted
                      ? "e.g. 5 days"
                      : "e.g. Not eligible for return"
                  }
                  value={isReturnAccepted ? returnTime : returnMessage}
                  onChange={(e) =>
                    isReturnAccepted
                      ? setReturnTime(e.target.value)
                      : setReturnMessage(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #444",
                    backgroundColor: "#3f3f46", // zinc-700
                    color: "white",
                  }}
                />
              </Box>

              {/* Admin Notes */}
              <Box sx={{ mb: 3, color: "white" }}>
                <Typography fontWeight="medium" sx={{ mb: 1 }}>
                  Admin Notes (optional)
                </Typography>
                <textarea
                  rows={3}
                  placeholder="Any internal notes regarding this return..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #444",
                    resize: "none",
                    backgroundColor: "#3f3f46", // zinc-700
                    color: "white",
                  }}
                />
              </Box>

              {/* Buttons */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowReturnModal(false)}
                  sx={{
                    color: "gray.300",
                    borderColor: "gray.500",
                    "&:hover": { borderColor: "white", color: "white" },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color={isReturnAccepted ? "success" : "error"}
                  onClick={() => handleSubmitReturnDecision()}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}

      <Box>
        <Card
          className="p-3"
          sx={{
            bgcolor: "#18181b",
            color: "white",
            border: "1px solid #27272a",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel
                  id="status-label"
                  shrink={true}
                  sx={{
                    color: "white",
                    backgroundColor: "#18181b",
                    zIndex: 2,
                    px: 1,
                    "&.Mui-focused": { color: "#818cf8" },
                  }}
                >
                  Status
                </InputLabel>
                <Select
                  labelId="status-label"
                  id="status-select"
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleChange}
                  displayEmpty
                  sx={{
                    color: "white",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "gray.600",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "gray.400",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#818cf8",
                    },
                    ".MuiSvgIcon-root": { color: "white" },
                  }}
                >
                  <MenuItem value={""}>
                    <em style={{ color: "gray", fontStyle: "normal" }}>All</em>
                  </MenuItem>
                  <MenuItem value={"PLACED"}>Placed</MenuItem>
                  <MenuItem value={"CONFIRMED"}>Confirmed</MenuItem>
                  <MenuItem value={"SHIPPED"}>Shipped</MenuItem>
                  <MenuItem value={"OUTFORDELIVERY"}>Out For Delivery</MenuItem>
                  <MenuItem value={"DELIVERED"}>Delivered</MenuItem>
                  <MenuItem value={"CANCELLED"}>Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel
                  id="sort-label"
                  shrink={true}
                  sx={{
                    color: "white",
                    backgroundColor: "#18181b",
                    zIndex: 2,
                    px: 1,
                    "&.Mui-focused": { color: "#818cf8" },
                  }}
                >
                  Sort By
                </InputLabel>
                <Select
                  labelId="sort-label"
                  id="sort-select"
                  name="sort"
                  value={formData.sort}
                  label="Sort By"
                  onChange={handleChange}
                  displayEmpty
                  sx={{
                    color: "white",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "gray.600",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "gray.400",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#818cf8",
                    },
                    ".MuiSvgIcon-root": { color: "white" },
                  }}
                >
                  <MenuItem value={""}>
                    <em style={{ color: "gray", fontStyle: "normal" }}>None</em>
                  </MenuItem>
                  <MenuItem value={"Newest"}>Newest</MenuItem>
                  <MenuItem value={"Oldest"}>Oldest</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>
        <Card
          className="mt-2"
          sx={{
            bgcolor: "#18181b",
            color: "white",
            border: "1px solid #27272a",
          }}
        >
          <CardHeader
            title="All Orders"
            sx={{
              pt: 2,
              alignItems: "center",
              "& .MuiCardHeader-action": { mt: 0.6 },
              "& .MuiCardHeader-title": { color: "white", fontWeight: "bold" },
            }}
          />
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Image
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Title
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Id
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Payment
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    View
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Update
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paidOrders.map((item, index) => (
                  <TableRow
                    hover
                    key={item._id}
                    sx={{
                      "&:last-of-type td, &:last-of-type th": { border: 0 },
                      "&:hover": { backgroundColor: "#27272a !important" }, // Hover effect
                    }}
                  >
                    {/* Image Column */}
                    <TableCell>
                      <AvatarGroup max={4} sx={{ justifyContent: "start" }}>
                        {item.orderItems.map((orderItem, idx) => (
                          <Avatar
                            key={idx}
                            alt={orderItem.product?.title}
                            src={
                              (Array.isArray(orderItem.product?.images) && orderItem.product?.images.length > 0)
                                ? orderItem.product?.images[0]
                                : (orderItem.product?.variants?.[0]?.images?.[0] || orderItem.product?.imageUrl?.[0] || orderItem.product?.imageUrl)
                            }
                            sx={{ width: 40, height: 40, border: "1px solid #3f3f46" }}
                          />
                        ))}
                      </AvatarGroup>
                    </TableCell>

                    {/* Title + Brand */}
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.875rem !important",
                            color: "white",
                          }}
                        >
                          {item.orderItems
                            .map((o) => o.product?.title)
                            .filter(Boolean)
                            .join(", ")}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ opacity: 0.6, color: "white" }}
                        >
                          {item.orderItems
                            .map((o) => o.product?.brand)
                            .filter(Boolean)
                            .join(", ")}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Price */}
                    <TableCell sx={{ color: "white" }}>
                      {item.totalDiscountedPrice}
                    </TableCell>

                    {/* Order ID */}
                    <TableCell sx={{ color: "white" }}>{item._id}</TableCell>

                    {/* Payment Button */}
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          handleViewPaymentHistory(item)
                        }
                        sx={{ color: "white", borderColor: "gray.600" }}
                      >
                        Payment History
                      </Button>
                    </TableCell>

                    {/* View Button */}
                    <TableCell>
                      <Button
                        onClick={() => handleOpenOrderModal(item)}
                        variant="outlined"
                        size="small"
                        sx={{ color: "white", borderColor: "gray.600" }}
                      >
                        View
                      </Button>
                    </TableCell>

                    {/* Status Chip */}
                    <TableCell className="text-white">
                      <Chip
                        sx={{
                          color: "white !important",
                          fontWeight: "bold",
                          textAlign: "center",
                          fontSize: "0.75rem",
                          height: "24px",
                        }}
                        label={item.orderStatus.replace(/_/g, " ")}
                        size="small"
                        color={
                          item.orderStatus === "PENDING"
                            ? "info"
                            : item.orderStatus === "CONFIRMED"
                              ? "warning"
                              : item.orderStatus === "SHIPPED"
                                ? "primary"
                                : item.orderStatus === "OUT_FOR_DELIVERY"
                                  ? "secondary"
                                  : item.orderStatus === "DELIVERED"
                                    ? "success"
                                    : item.orderStatus === "RETURNED"
                                      ? "success"
                                      : item.orderStatus === "RETURNED_REQUESTED"
                                        ? "warning"
                                        : item.orderStatus === "CANCELLED"
                                          ? "error"
                                          : "default"
                        }
                      />
                    </TableCell>

                    {/* Status Update Menu */}
                    <TableCell
                      sx={{ textAlign: "center" }}
                      className="text-white"
                    >
                      {updatingOrderId === item._id ? (
                        <div className="flex justify-center">
                          <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <div>
                          <Button
                            id={`basic-button-${item._id}`}
                            aria-controls={`basic-menu-${item._id}`}
                            aria-haspopup="true"
                            aria-expanded={
                              Boolean(anchorElArray[index]) ? "true" : undefined
                            }
                            onClick={(event) =>
                              handleUpdateStatusMenuClick(event, index)
                            }
                            variant="contained"
                            size="small"
                            sx={{
                              bgcolor: "#4f46e5",
                              "&:hover": { bgcolor: "#4338ca" },
                            }} // Indigo-600
                          >
                            Status
                          </Button>
                          <Menu
                            id={`basic-menu-${item._id}`}
                            anchorEl={anchorElArray[index]}
                            open={Boolean(anchorElArray[index])}
                            onClose={() => handleUpdateStatusMenuClose(index)}
                            MenuListProps={{
                              "aria-labelledby": `basic-button-${item._id}`,
                            }}
                          >
                            <MenuItem
                              onClick={() =>
                                handleConfirmedOrder(item._id, index)
                              }
                              disabled={
                                item.orderStatus === "DELIVERED" ||
                                item.orderStatus === "SHIPPED" ||
                                item.orderStatus === "OUT_FOR_DELIVERY" ||
                                item.orderStatus === "CONFIRMED"
                              }
                            >
                              Confirmed Status
                            </MenuItem>
                            <MenuItem
                              disabled={
                                item.orderStatus === "DELIVERED" ||
                                item.orderStatus === "OUT_FOR_DELIVERY" ||
                                item.orderStatus === "SHIPPED"
                              }
                              onClick={() =>
                                handleShippedOrder(item._id, index)
                              }
                            >
                              Shipped Order
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleOutForDeliveryOrder(item._id, index)
                              }
                              disabled={
                                item.orderStatus === "DELIVERED" ||
                                item.orderStatus === "OUT_FOR_DELIVERY"
                              }
                            >
                              Out For Delivery
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleDeliveredOrder(item._id, index)
                              }
                              disabled={
                                item.orderStatus === "DELIVERED" ||
                                item.orderStatus === "RETURNED_REQUESTED" ||
                                item.orderStatus === "RETURNED"
                              }
                            >
                              Delivered Order
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleReturnOrder(item._id, index)}
                              disabled={
                                item.orderStatus === "RETURNED_REQUESTED" ||
                                item.orderStatus === "RETURNED"
                              }
                            >
                              Return Order
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleReturnedOrder(item._id, index)
                              }
                              disabled={item.orderStatus === "RETURNED"}
                            >
                              Returned Order
                            </MenuItem>
                          </Menu>
                        </div>
                      )}
                    </TableCell>

                    {/* Delete Options (Delete / Return) */}
                    <TableCell sx={{ textAlign: "center" }}>
                      {item.orderStatus === "RETURNED_REQUESTED" ? (
                        <Button
                          onClick={() => handleOpenReturnModal(item)}
                          variant="contained"
                          color="warning"
                          size="small"
                        >
                          Review
                        </Button>
                      ) : item.orderStatus === "RETURN_APPROVED" ? (
                        <Chip
                          label="Return Approved"
                          color="success"
                          size="small"
                        />
                      ) : item.orderStatus === "RETURN_REJECTED" ? (
                        <Chip
                          label="Return Rejected"
                          color="error"
                          size="small"
                        />
                      ) : (
                        <Button
                          onClick={() => handleDeleteOrder(item._id)}
                          variant="outlined"
                          color="error" // Red
                          size="small"
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this order? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default OrdersTable;