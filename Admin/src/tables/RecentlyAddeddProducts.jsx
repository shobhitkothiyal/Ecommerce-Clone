import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import React from "react";
import { useNavigate } from "react-router-dom";

const RecentlyAddeddProducts = ({ products = [] }) => {
  const navigate = useNavigate();

  const calculateStock = (stock) => {
    if (!stock) return 0;
    if (typeof stock === "number") return stock;
    if (typeof stock === "object") {
      // Sum values of keys (S, M, L, etc.)
      return Object.values(stock).reduce(
        (acc, val) => acc + (Number(val) || 0),
        0
      );
    }
    return 0;
  };

  return (
    <Card
      sx={{
        bgcolor: "#18181b",
        color: "white",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "none",
      }}
    >
      <CardHeader
        title="Recently Added Products"
        sx={{
          pt: 2,
          alignItems: "center",
          "& .MuiCardHeader-action": { mt: 0.6 },
          "& .MuiCardHeader-title": { color: "white" },
        }}
        action={
          <Typography
            onClick={() => navigate("/admin/products")}
            variant="caption"
            sx={{
              color: "#818cf8",
              cursor: "pointer",
              paddingRight: ".8rem",
              fontWeight: 600,
              "&:hover": { color: "#6366f1" },
            }}
          >
            View All
          </Typography>
        }
        titleTypographyProps={{
          variant: "h5",
          sx: {
            lineHeight: "1.6 !important",
            letterSpacing: "0.15px !important",
          },
        }}
      />
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "gray" }}>Image</TableCell>
              <TableCell sx={{ color: "gray" }}>Title</TableCell>
              <TableCell sx={{ color: "gray" }}>Category</TableCell>
              <TableCell sx={{ color: "gray" }}>Price</TableCell>
              <TableCell sx={{ color: "gray" }}>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.slice(0, 5).map((item) => (
              <TableRow
                hover
                key={item._id}
                sx={{
                  "&:last-of-type td, &:last-of-type th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.05) !important",
                  },
                }}
              >
                <TableCell>
                  <Avatar
                    alt={item.title}
                    src={
                      (Array.isArray(item.images) && item.images.length > 0)
                        ? item.images[0]
                        : (item.variants?.[0]?.images?.[0] || item.imageUrl?.[0] || item.image || "/default-product.png")
                    }
                    variant="rounded"
                    sx={{ width: 50, height: 50, border: "1px solid #3f3f46" }}
                  />
                </TableCell>

                <TableCell
                  sx={{ py: (theme) => `${theme.spacing(0.5)} !important` }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.875rem !important",
                        color: "white",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "gray" }}>
                      {item.brand}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: "gray.300" }}>
                  {item.category?.name || "N/A"}
                </TableCell>
                <TableCell sx={{ color: "gray.300" }}>
                  ₹
                  {item.variants?.[0]?.price ||
                    item.price ||
                    item.discountedPrice ||
                    0}
                </TableCell>
                <TableCell sx={{ color: "gray.300" }}>
                  {calculateStock(
                    item.variants?.[0]?.stock || item.quantity || 0
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default RecentlyAddeddProducts;