import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import {
  Avatar,
  CardHeader,
  Pagination,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Define local dark theme for this component or reuse global if available
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1", // Indigo-500
    },
    background: {
      paper: "#18181b", // Zinc-900
      default: "#000000",
    },
    text: {
      primary: "#ffffff",
      secondary: "#9ca3af", // Gray-400
    },
  },
});

const Queries = () => {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // items per page

  // For Status Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQueryId, setSelectedQueryId] = useState(null);

  // For Delete Confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState(null);

  const BASE_URL = import.meta.env.VITE_React_BASE_API_URL;

  // Fetch Queries
  const fetchQueries = async (pageNo = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${BASE_URL}/api/queries?page=${pageNo}&limit=${limit}`,
        config
      );
      // Expected response: { queries: [...], totalQueries: 25, totalPages: 3, currentPage: 1 }
      setQueries(response.data.queries);
      setTotalPages(response.data.totalPages);
      setPage(response.data.currentPage);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching queries: ", err);
      setError("Failed to fetch queries.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries(page);
  }, [page]);

  const handlePaginationChange = (event, value) => {
    setPage(value);
  };

  // --- Status Update Handlers ---
  const handleStatusClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedQueryId(id);
  };

  const handleStatusClose = () => {
    setAnchorEl(null);
    setSelectedQueryId(null);
  };

  const updateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem("jwt");
      await axios.put(
        `${BASE_URL}/api/queries/${selectedQueryId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update local state
      setQueries((prev) =>
        prev.map((q) =>
          q._id === selectedQueryId ? { ...q, status: newStatus } : q
        )
      );
      handleStatusClose();
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status");
    }
  };

  // --- Delete Handlers ---
  const handleDeleteClick = (id) => {
    setQueryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(`${BASE_URL}/api/queries/${queryToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Remove from list
      setQueries((prev) => prev.filter((q) => q._id !== queryToDelete));
      setDeleteDialogOpen(false);
      setQueryToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete query");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setQueryToDelete(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ width: "100%", typography: "body1", color: "text.primary" }}>
        <Card
          sx={{
            bgcolor: "#18181b",
            color: "white",
            border: "1px solid #27272a",
          }}
        >
          <CardHeader
            title="Customer Queries"
            sx={{
              pt: 2,
              alignItems: "center",
              "& .MuiCardHeader-action": { mt: 0.6 },
              "& .MuiCardHeader-title": { color: "white" },
            }}
          />
          <TableContainer>
            <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "gray.400" }}>Name</TableCell>
                  <TableCell sx={{ color: "gray.400" }}>Email</TableCell>
                  <TableCell sx={{ color: "gray.400" }}>Subject</TableCell>
                  <TableCell sx={{ color: "gray.400" }}>Message</TableCell>
                  <TableCell sx={{ color: "gray.400" }}>Date</TableCell>
                  <TableCell sx={{ color: "gray.400" }}>Status</TableCell>
                  <TableCell sx={{ color: "gray.400" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ color: "gray.400" }}
                    >
                      <CircularProgress size={24} color="inherit" />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ color: "red.400" }}
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : queries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ color: "gray.400" }}
                    >
                      No queries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  queries.map((item) => (
                    <TableRow
                      hover
                      key={item._id}
                      sx={{
                        "&:last-of-type td, &:last-of-type th": { border: 0 },
                        "&:hover": { backgroundColor: "#27272a !important" },
                      }}
                    >
                      <TableCell
                        sx={{
                          py: (theme) => `${theme.spacing(0.5)} !important`,
                        }}
                      >
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: "0.875rem !important",
                              color: "white",
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "gray.300" }}>
                        {item.email}
                      </TableCell>
                      <TableCell sx={{ color: "gray.300" }}>
                        {item.subject}
                      </TableCell>
                      <TableCell sx={{ color: "gray.400", maxWidth: 300 }}>
                        <Typography noWrap variant="body2" title={item.message}>
                          {item.message}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: "gray.400" }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status || "Pending"}
                          color={
                            item.status === "Resolved"
                              ? "success"
                              : item.status === "In Progress"
                              ? "warning"
                              : "default"
                          }
                          size="small"
                          sx={{ fontWeight: "bold", color: "white" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => handleStatusClick(e, item._id)}
                          sx={{
                            mr: 1,
                            color: "indigo.300",
                            borderColor: "indigo.800",
                          }}
                        >
                          Update
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => handleDeleteClick(item._id)}
                          sx={{ color: "red.300", borderColor: "red.900" }}
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

        {/* Status Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleStatusClose}
          PaperProps={{
            sx: {
              bgcolor: "#27272a",
              color: "white",
            },
          }}
        >
          <MenuItem onClick={() => updateStatus("Pending")}>Pending</MenuItem>
          <MenuItem onClick={() => updateStatus("In Progress")}>
            In Progress
          </MenuItem>
          <MenuItem onClick={() => updateStatus("Resolved")}>Resolved</MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: {
              bgcolor: "#18181b",
              color: "white",
              border: "1px solid #3f3f46",
            },
          }}
        >
          <DialogTitle sx={{ color: "white" }}>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "gray.400" }}>
              Are you sure you want to delete this query? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} sx={{ color: "gray.400" }}>
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} autoFocus color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Card
          className="mt-2 text-center"
          sx={{
            bgcolor: "#18181b",
            color: "white",
            border: "1px solid #27272a",
          }}
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
            }}
          />
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default Queries;