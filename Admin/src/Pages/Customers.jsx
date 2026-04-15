// ** MUI Imports
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
  CardHeader,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Paper,
} from "@mui/material";
import { allUser } from "../Redux/Auth/Action";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Customers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const dispatch = useDispatch();
  const { userList, isLoading, currentPage, totalPages } = useSelector(
    (store) => store.auth
  );

  console.log("customers...", userList);
  const navigate = useNavigate();

  function handlePaginationChange(event, value) {
    setSearchParams({ page: value.toString() });
  }

  useEffect(() => {
    dispatch(allUser(page));
  }, [dispatch, page]);

  // Modal State
  const [openval, setOpenval] = React.useState(false);
  const [userOrders, setUserOrders] = React.useState([]);
  const [loadingOrders, setLoadingOrders] = React.useState(false);

  // Import API_BASE_URL and axios inside or use existing config
  const API_BASE_URL = "http://localhost:8000"; // Or import from config
  const token = localStorage.getItem("jwt");

  const handleOpenOrders = async (userId) => {
    setOpenval(true);
    setLoadingOrders(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/orders/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setUserOrders(data);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCloseOrders = () => {
    setOpenval(false);
    setUserOrders([]);
  };

  return (
    <Box>
      <Card
        sx={{ bgcolor: "#18181b", color: "white", border: "1px solid #27272a" }}
      >
        <CardHeader
          title="All Customers"
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
            "& .MuiCardHeader-title": { color: "white", fontWeight: "bold" },
          }}
        />
        <TableContainer>
          <Table sx={{ minWidth: 390 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  #
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Orders
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ color: "white" }}>
              {userList?.map((item, index) => (
                <TableRow
                  hover
                  key={item._id}
                  sx={{
                    "&:last-of-type td, &:last-of-type th": { border: 0 },
                    "&:hover": { backgroundColor: "#27272a !important" },
                  }}
                >
                  <TableCell sx={{ color: "white" }}>{index + 1}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "medium" }}>
                    {item.firstName && item.lastName
                      ? `${item.firstName} ${item.lastName}`
                      : item.username || "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>{item.email}</TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    {item.orders?.length || 0}
                  </TableCell>
                  <TableCell align="center">
                    <button
                      onClick={() => handleOpenOrders(item._id)}
                      className="px-4 py-1.5 text-sm rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Card
        className="mt-2 flex justify-center items-center"
        sx={{ bgcolor: "#18181b", color: "white", border: "1px solid #27272a" }}
      >
        <div className="py-5">
          <Pagination
            size="large"
            count={totalPages || 10}
            page={page}
            color="primary"
            onChange={handlePaginationChange}
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

      {/* Orders Modal */}
      <Dialog
        open={openval}
        onClose={handleCloseOrders}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "#1c1c1c",
            color: "white",
            border: "1px solid #333",
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid #333",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>User Orders</span>
          <Button onClick={handleCloseOrders} sx={{ color: "gray" }}>
            ✕
          </Button>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {loadingOrders ? (
            <div className="flex justify-center p-5">Loading...</div>
          ) : userOrders.length > 0 ? (
            <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
              <Table size="small" aria-label="orders table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#aaa" }}>Order ID</TableCell>
                    <TableCell sx={{ color: "#aaa" }}>Date</TableCell>
                    <TableCell sx={{ color: "#aaa" }}>Status</TableCell>
                    <TableCell sx={{ color: "#aaa" }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell sx={{ color: "white" }}>
                        #{order._id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            order.orderStatus === "DELIVERED"
                              ? "bg-green-900 text-green-200"
                              : order.orderStatus === "CANCELLED"
                              ? "bg-red-900 text-red-200"
                              : "bg-yellow-900 text-yellow-200"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        ₹{order.totalDiscountedPrice}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p className="text-center text-gray-400 py-4">
              No orders found for this user.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Customers;