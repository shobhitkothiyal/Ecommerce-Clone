import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  CircularProgress,
  IconButton,
  Card,
  CardHeader,
  TableContainer,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import CouponModal from "./CouponModal";
import { getAllCoupons, deleteCoupon } from "../Redux/Admin/Coupon/Action";
import { CREATE_COUPON_SUCCESS } from "../Redux/Admin/Coupon/ActionType";

function Coupan() {
  const [openModal, setOpenModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const dispatch = useDispatch();
  const {
    loading,
    coupons = [],
    error,
  } = useSelector((state) => state.createCoupon || {});

  useEffect(() => {
    dispatch(getAllCoupons());
  }, [dispatch, openModal]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    await dispatch(deleteCoupon(id));
    setDeletingId(null);
    dispatch(getAllCoupons());
  };

  const handleEdit = (coupon) => {
    dispatch({ type: CREATE_COUPON_SUCCESS, payload: {} });
    setEditingCoupon(coupon);
    setOpenModal(true);
  };

  useEffect(() => {
    if (!openModal) {
      dispatch({ type: CREATE_COUPON_SUCCESS, payload: {} });
      setEditingCoupon(null);
    }
  }, [openModal, dispatch]);

  return (
    <div className="p-4 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
          Coupon Management
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4f46e5", // Indigo-600
            "&:hover": {
              backgroundColor: "#4338ca", // Indigo-700
            },
            color: "white",
            fontWeight: "bold",
            padding: "8px 20px",
          }}
          onClick={() => {
            dispatch({ type: CREATE_COUPON_SUCCESS, payload: {} });
            setEditingCoupon(null);
            setOpenModal(true);
          }}
        >
          Create Coupon
        </Button>
      </div>

      {openModal && (
        <CouponModal
          onClose={() => setOpenModal(false)}
          couponData={editingCoupon}
        />
      )}

      {loading ? (
        <div className="flex justify-center mt-10">
          <CircularProgress color="inherit" sx={{ color: "#818cf8" }} />
        </div>
      ) : error ? (
        <Typography color="error" align="center" variant="h6">
          {error}
        </Typography>
      ) : (
        <Card
          sx={{
            bgcolor: "#18181b", // Zinc-900
            color: "white",
            border: "1px solid #27272a", // Zinc-800
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Code
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Discount Type
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Value
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Min Order
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Usage Limit
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Used By
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Expires At
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow
                    key={coupon._id}
                    sx={{
                      "&:last-of-type td, &:last-of-type th": { border: 0 },
                      "&:hover": { backgroundColor: "#27272a" }, // Zinc-800 hover
                    }}
                  >
                    <TableCell sx={{ color: "white", fontWeight: "medium" }}>
                      {coupon.code}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {coupon.discountType}
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      {coupon.discountType === "flat"
                        ? `₹${coupon.discountValue}`
                        : `${coupon.discountValue}%`}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      ₹{coupon.minOrderAmount}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {coupon.usageLimit}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {coupon.usedBy?.length || 0}
                    </TableCell>
                    <TableCell
                      sx={{
                        color:
                          coupon.expiresAt &&
                          new Date(coupon.expiresAt) < new Date()
                            ? "#f87171" // Red for Expired
                            : coupon.isActive
                              ? "#4ade80"
                              : "#f87171",
                        fontWeight: "bold",
                      }}
                    >
                      {coupon.expiresAt &&
                      new Date(coupon.expiresAt) < new Date()
                        ? "Expired"
                        : coupon.isActive
                          ? "Active"
                          : "Inactive"}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(coupon)}
                        sx={{ mr: 1, color: "#818cf8" }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(coupon._id)}
                        disabled={deletingId === coupon._id}
                        sx={{ color: "#f87171" }}
                      >
                        {deletingId === coupon._id ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {coupons.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      sx={{ py: 4, color: "gray.400" }}
                    >
                      No coupons found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </div>
  );
}

export default Coupan;