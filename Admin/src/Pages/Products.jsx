
// src/components/ProductsTable.jsx
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProducts, deleteProduct } from "../Redux/Customers/Product/Action";

const ProductsTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const customersProduct = useSelector((store) => store.customersProduct);
  const productsState = customersProduct.products || {
    content: [],
    currentPage: 1,
    totalPages: 1,
  };
  const loading = customersProduct.loading;
  const error = customersProduct.error;

  const [filterValue, setFilterValue] = useState({
    availability: "",
    category: "",
    sort: "",
  });

  const searchParams = new URLSearchParams(location.search);
  const availability = searchParams.get("availability");
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");
  const page = Number(searchParams.get("page")) || 1;

  const buildReqData = () => {
    return {
      category: category || "",
      colors: [],
      sizes: [],
      minPrice: 0,
      maxPrice: 100000,
      minDiscount: 0,
      sort: sort || "price_low",
      pageNumber: page || 1,
      pageSize: 10,
      stock: availability && availability !== "All" ? availability : "",
    };
  };

  useEffect(() => {
    setFilterValue({
      availability: availability || "",
      category: category || "",
      sort: sort || "",
    });

    const reqData = buildReqData();
    dispatch(findProducts(reqData)).catch((err) => {
      console.error("findProducts error:", err);
    });
  }, [
    availability,
    category,
    sort,
    page,
    dispatch,
    customersProduct.deleteProduct,
  ]);

  const handlePaginationChange = (event, value) => {
    searchParams.set("page", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handleFilterChange = (e, sectionId) => {
    setFilterValue((values) => ({ ...values, [sectionId]: e.target.value }));
    if (!e.target.value) searchParams.delete(sectionId);
    else searchParams.set(sectionId, e.target.value);
    searchParams.set("page", 1);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId) return;
    try {
      if (!window.confirm("Delete this product?")) return;
      await dispatch(deleteProduct(productId));
    } catch (err) {
      console.error("Delete product error:", err);
      alert(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  const handleUpdateProduct = (product) => {
    navigate("/add-product", { state: { product } });
  };

  // Reusable Select Menu Styling
  const darkMenuProps = {
    PaperProps: {
      sx: {
        bgcolor: "#18181b",
        color: "white",
        border: "1px solid #3f3f46",
        "& .MuiMenuItem-root": {
          "&:hover": { bgcolor: "#27272a" },
          "&.Mui-selected": {
            bgcolor: "#3730a3",
            "&:hover": { bgcolor: "#312e81" },
          },
        },
      },
    },
  };

  return (
    <Box width={"100%"}>
      <Card
        className="p-3"
        sx={{ bgcolor: "#18181b", color: "white", border: "1px solid #27272a" }}
      >
        <CardHeader
          title="Filter Products"
          sx={{
            pt: 0,
            pb: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
            "& .MuiCardHeader-title": {
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
            },
          }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel
                id="category-select-label"
                shrink={true}
                sx={{
                  color: "white",
                  backgroundColor: "#18181b",
                  zIndex: 2,
                  px: 1,
                  "&.Mui-focused": { color: "#818cf8" },
                }}
              >
                Category
              </InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={filterValue.category}
                label="Category"
                onChange={(e) => handleFilterChange(e, "category")}
                MenuProps={darkMenuProps}
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
                  <em style={{ color: "gray", fontStyle: "normal" }}>
                    All Category
                  </em>
                </MenuItem>
                <MenuItem value={"pant"}>Men's Pants</MenuItem>
                <MenuItem value={"mens_kurta"}>Men's Kurta</MenuItem>
                <MenuItem value={"saree"}>Saree</MenuItem>
                <MenuItem value={"lengha_choli"}>Lengha Choli</MenuItem>
                <MenuItem value={"dress"}>Dress</MenuItem>
                <MenuItem value={"top"}>Top</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel
                id="availability-select-label"
                shrink={true}
                sx={{
                  color: "white",
                  backgroundColor: "#18181b",
                  zIndex: 2,
                  px: 1,
                  "&.Mui-focused": { color: "#818cf8" },
                }}
              >
                Availability
              </InputLabel>
              <Select
                labelId="availability-select-label"
                id="availability-select"
                value={filterValue.availability}
                label="Availability"
                onChange={(e) => handleFilterChange(e, "availability")}
                MenuProps={darkMenuProps}
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
                  <em style={{ color: "gray", fontStyle: "normal" }}>
                    All Status
                  </em>
                </MenuItem>
                <MenuItem value={"in_stock"}>Instock</MenuItem>
                <MenuItem value={"out_of_stock"}>Out Of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel
                id="sort-select-label"
                shrink={true}
                sx={{
                  color: "white",
                  backgroundColor: "#18181b",
                  zIndex: 2,
                  px: 1,
                  "&.Mui-focused": { color: "#818cf8" },
                }}
              >
                Sort By Price
              </InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={filterValue.sort}
                label="Sort By Price"
                onChange={(e) => handleFilterChange(e, "sort")}
                MenuProps={darkMenuProps}
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
                <MenuItem value={"price_high"}>High - Low</MenuItem>
                <MenuItem value={"price_low"}>Low - High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      <Card
        className="mt-2"
        sx={{ bgcolor: "#18181b", color: "white", border: "1px solid #27272a" }}
      >
        <CardHeader
          title="All Products"
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
            "& .MuiCardHeader-title": { color: "white", fontWeight: "bold" },
          }}
        />
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Image
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Title
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Price
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Discounted Price
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Variants
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Details
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
            <TableBody sx={{ color: "white" }}>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={9} // Adjusted colspan
                    align="center"
                    sx={{ color: "gray.400", py: 5 }}
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    align="center"
                    sx={{ color: "red.400", py: 5 }}
                  >
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : (productsState?.content?.length || 0) === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    align="center"
                    sx={{ color: "gray.400", py: 5 }}
                  >
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                productsState.content.map((item) => (
                  <TableRow
                    hover
                    key={item._id || item.id || item.title}
                    sx={{
                      "&:last-of-type td, &:last-of-type th": { border: 0 },
                      "&:hover": { backgroundColor: "#27272a !important" },
                    }}
                  >
                    <TableCell>
                      <Box
                        onClick={() =>
                          navigate(`/product-details/${item._id}`, {
                            state: { product: item },
                          })
                        }
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius: "12px",
                          overflow: "hidden",
                          border: "1px solid #3f3f46",
                          bgcolor: "#27272a",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          position: "relative",
                          "&:hover": {
                            transform: "scale(1.15) rotate(2deg)",
                            boxShadow: "0 15px 30px rgba(0,0,0,0.6)",
                            borderColor: "#6366f1", // Indigo 500
                            zIndex: 10,
                          },
                        }}
                      >
                        <img
                          alt={item.title}
                          src={
                            (Array.isArray(item.images) && item.images.length > 0)
                              ? item.images[0]
                              : (item.variants?.[0]?.images?.[0] || (typeof item.images === 'string' ? item.images : (item.imageUrl?.[0] || item.imageUrl)))
                          }
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease"
                          }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell
                      sx={{
                        py: (theme) => `${theme.spacing(0.5)} !important`,
                        maxWidth: 300,
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.875rem !important",
                            color: "white",
                          }}
                          noWrap
                        >
                          {item.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "white" }}>
                          {item.brand}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "white" }}>
                      {item.category?.name || item.category}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {item.variants?.[0]?.price
                        ? `₹${item.variants[0].price}`
                        : "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {item.variants?.[0]?.price && item.discountedPercent > 0
                        ? `₹${Math.round(
                          item.variants[0].price *
                          (1 - item.discountedPercent / 100)
                        )}`
                        : "-"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "white" }}>
                      {(() => {
                        const stock = item.variants?.[0]?.stock;
                        if (typeof stock === "object" && stock !== null) {
                          return Object.values(stock).reduce(
                            (a, b) => a + (Number(b) || 0),
                            0
                          );
                        }
                        return stock || 0;
                      })()}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", color: "white" }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          alignItems: "center",
                        }}
                      >
                        {item.variants?.slice(0, 3).map((v, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 px-2 py-1 rounded-md bg-zinc-800 border border-white/10 w-max shadow-sm"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-gray-500 shrink-0"
                              style={{ backgroundColor: v.hex || "#000" }}
                            ></span>
                            <span className="text-xs text-gray-300 capitalize font-medium">
                              {v.color}
                            </span>
                            <span className="text-xs text-zinc-600">|</span>
                            <span className="text-xs text-indigo-400 font-semibold">
                              ₹{v.price}
                            </span>
                          </div>
                        ))}
                        {item.variants?.length > 3 && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "gray",
                              fontSize: "0.7rem",
                              mt: 0.5,
                              fontStyle: "italic",
                            }}
                          >
                            +{item.variants.length - 3} more
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",

                      }}

                    >
                      <Button
                        variant="text"
                        onClick={() =>
                          navigate(`/product-details/${item._id}`, {
                            state: { product: item },
                          })
                        }
                        sx={{ color: "#818cf8", fontWeight: "bold", cursor: "pointer" }}
                      >
                        View Details
                      </Button>
                    </TableCell>

                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="text"
                        onClick={() => handleUpdateProduct(item)}
                        sx={{ color: "#818cf8", fontWeight: "bold" }}
                      >
                        Update
                      </Button>
                    </TableCell>

                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="text"
                        onClick={() => handleDeleteProduct(item._id)}
                        sx={{ color: "#f87171", fontWeight: "bold" }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card
        className="mt-2 border"
        sx={{ bgcolor: "#18181b", borderColor: "#27272a" }}
      >
        <div className="mx-auto px-4 py-5 flex justify-center shadow-lg rounded-md">
          <Pagination
            count={productsState?.totalPages || 1}
            color="primary"
            onChange={handlePaginationChange}
            page={Number(page)}
            sx={{
              button: { color: "white" },
              ".Mui-selected": {
                bgcolor: "#4f46e5 !important", // Indigo-600
                color: "white",
              },
              ".MuiPaginationItem-ellipsis": { color: "white" },
            }}
          />
        </div>
      </Card>
    </Box>
  );
};

export default ProductsTable;
