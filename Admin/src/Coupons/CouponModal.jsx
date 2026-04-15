import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createdCoupon, updateCoupon } from "../Redux/Admin/Coupon/Action";
import { motion } from "framer-motion";

const CouponModal = ({ onClose, couponData }) => {
  const dispatch = useDispatch();
  const isEditMode = !!couponData;
  const { loading, success, error, message } = useSelector(
    (store) => store.createCoupon,
  );

  const [formData, setFormData] = useState({
    code: "",
    discountType: "flat",
    discountValue: "",
    minOrderAmount: "",
    usageLimit: "",
    isActive: true,
    expiresAt: "",
    maxDiscountValue: "",
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (isEditMode) {
      dispatch(updateCoupon(formData, couponData._id));
    } else {
      dispatch(createdCoupon(formData));
    }
  };

  useEffect(() => {
    if (couponData) {
      setFormData({
        ...couponData,
        expiresAt: couponData.expiresAt
          ? new Date(couponData.expiresAt).toISOString().split("T")[0]
          : "",
      });
    }
  }, [couponData]);

  useEffect(() => {
    if (hasSubmitted && !loading && success) {
      const timer = setTimeout(() => {
        onClose();
        setHasSubmitted(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [hasSubmitted, loading, success, onClose]);

  // Common styling for TextFields
  const textFieldSz = {
    mt: 3,
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": { borderColor: "#3f3f46" }, // zinc-700
      "&:hover fieldset": { borderColor: "gray" },
      "&.Mui-focused fieldset": { borderColor: "#818cf8" }, // indigo-400
    },
    "& .MuiInputLabel-root": { color: "#9ca3af" }, // gray-400
    "& .MuiInputLabel-root.Mui-focused": { color: "#818cf8" },
    "& .MuiSelect-icon": { color: "white" },
    "& input[type='date']::-webkit-calendar-picker-indicator": {
      filter: "invert(1)",
      cursor: "pointer",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box
        sx={{
          width: "95vw",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          p: 4,
          borderRadius: 3,
          backgroundColor: "#18181b", // Zinc-900
          border: "1px solid #27272a", // Zinc-800
          boxShadow: 24,
          position: "relative",
          color: "white",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "gray",
            "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          <Close />
        </IconButton>

        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          {isEditMode ? "Update Coupon" : "Create New Coupon"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {success && hasSubmitted && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message || "Coupon created successfully!"}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            sx={textFieldSz}
            label="Coupon Code"
            name="code"
            fullWidth
            required
            value={formData.code}
            onChange={handleChange}
          />

          <TextField
            sx={textFieldSz}
            label="Discount Type"
            name="discountType"
            fullWidth
            required
            select
            slotProps={{
              select: {
                MenuProps: {
                  PaperProps: {
                    sx: {
                      zIndex: 1500,
                      bgcolor: "#18181b",
                      color: "white",
                      border: "1px solid #3f3f46",
                      "& .MuiMenuItem-root": {
                        "&:hover": { bgcolor: "#27272a" },
                        "&.Mui-selected": {
                          bgcolor: "#3730a3",
                          "&:hover": { bgcolor: "#312e81" },
                        }, // indigo-900/800
                      },
                    },
                  },
                  disablePortal: true,
                },
              },
            }}
            value={formData.discountType}
            onChange={handleChange}
          >
            <MenuItem value="flat">Flat</MenuItem>
            <MenuItem value="percentage">Percentage</MenuItem>
          </TextField>

          <TextField
            sx={textFieldSz}
            label="Discount Value"
            name="discountValue"
            type="number"
            fullWidth
            required
            value={formData.discountValue}
            onChange={handleChange}
          />

          {formData.discountType === "percentage" && (
            <TextField
              sx={textFieldSz}
              label="Max Discount Limit (Optional)"
              name="maxDiscountValue"
              type="number"
              fullWidth
              value={formData.maxDiscountValue}
              onChange={handleChange}
            />
          )}

          <TextField
            sx={textFieldSz}
            label="Minimum Order Amount"
            name="minOrderAmount"
            type="number"
            fullWidth
            required
            value={formData.minOrderAmount}
            onChange={handleChange}
          />

          <TextField
            sx={textFieldSz}
            label="Usage Limit"
            name="usageLimit"
            type="number"
            fullWidth
            required
            value={formData.usageLimit}
            onChange={handleChange}
          />

          <TextField
            sx={textFieldSz}
            label="Expiry Date"
            name="expiresAt"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true, sx: { color: "#9ca3af" } }}
            value={formData.expiresAt}
            onChange={handleChange}
          />

          <Button
            sx={{
              mt: 4,
              py: 1.5,
              fontWeight: "bold",
              bgcolor: "#4f46e5",
              color: "white",
              "&:hover": { bgcolor: "#4338ca" },
            }}
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : isEditMode
                ? "Update Coupon"
                : "Create Coupon"}
          </Button>
        </form>
      </Box>
    </motion.div>
  );
};

export default CouponModal;