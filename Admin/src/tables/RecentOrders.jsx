import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const RecentOrders = ({ orders = [] }) => {
  const navigate = useNavigate();

  // Helper to safely get first product info
  const getFirstProduct = (order) => {
    const first = order?.orderItems?.[0];
    if (!first) return {};
    return first.product || {};
  };

  const handleRowClick = (orderId) => {
    if (!orderId) return;
    navigate(`/orders/${orderId}`);
  };

  return (
    <Card
      sx={{
        backgroundColor: "#18181b", // Zinc-900
        color: "white",
        borderRadius: 2,
        boxShadow: "none",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
      aria-label="Recent orders"
    >
      <CardHeader
        title="Recent Orders"
        sx={{
          pt: 2,
          alignItems: "center",
          "& .MuiCardHeader-action": { mt: 0.6 },
          "& .MuiCardHeader-title": { color: "white" },
        }}
        action={
          <Typography
            onClick={() => navigate("/orders")}
            variant="caption"
            sx={{
              color: "#818cf8",
              cursor: "pointer",
              paddingRight: ".8rem",
              fontWeight: 600,
              "&:hover": { color: "#6366f1" },
            }}
          >
            View All →
          </Typography>
        }
        titleTypographyProps={{
          variant: "h6",
          sx: {
            lineHeight: "1.6 !important",
            letterSpacing: "0.15px !important",
            fontWeight: 700,
          },
        }}
      />

      <TableContainer>
        <Table sx={{ minWidth: 720 }} aria-label="recent orders table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "gray" }}>
                Image
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "gray" }}>
                Title
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "gray" }}>
                Price
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "gray" }}>
                Order ID
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "gray" }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.slice(0, 10).map((order, index) => {
                const item = getFirstProduct(order);
                const imageSrc =
                  (Array.isArray(item?.images) && item.images.length > 0)
                    ? item.images[0]
                    : (item?.variants?.[0]?.images?.[0] || item?.imageUrl?.[0] || item?.image || "/default-product.png");
                const title =
                  item?.title ||
                  order?.orderItems?.[0]?.product?.title ||
                  order?.orderItems?.[0]?.name ||
                  order?.orderItems?.[0]?.productName ||
                  item?.name ||
                  "Untitled product";
                const price =
                  order?.totalDiscountedPrice ?? order?.totalPrice ?? 0;
                const orderId =
                  order?._id || order?.orderId || `ORD-${index + 1}`;
                const status = (order?.orderStatus || "PENDING").toUpperCase();

                // choose chip color
                const chipColor =
                  status === "DELIVERED"
                    ? "success"
                    : status === "CANCELLED"
                      ? "error"
                      : "warning";

                return (
                  <TableRow
                    hover
                    key={orderId}
                    sx={{
                      cursor: orderId ? "pointer" : "default",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.05) !important",
                      },
                    }}
                    onClick={() => handleRowClick(orderId)}
                  >
                    <TableCell>
                      <Avatar
                        alt={title}
                        src={imageSrc}
                        variant="rounded"
                        sx={{ width: 50, height: 50, border: "1px solid #3f3f46" }}
                      />
                    </TableCell>

                    <TableCell
                      sx={{
                        py: (theme) => `${theme.spacing(0.75)} !important`,
                        maxWidth: 280,
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            color: "white",
                          }}
                          noWrap
                        >
                          {title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "gray.400" }}
                          noWrap
                        >
                          {item?.brand || ""}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ color: "gray.300" }}>
                      ₹{price.toLocaleString()}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.9rem",
                        color: "gray.300",
                      }}
                    >
                      {orderId}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={status}
                        size="small"
                        color={chipColor}
                        sx={{ color: "#fff", fontWeight: 700 }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="gray.500">
                    No recent orders.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default RecentOrders;