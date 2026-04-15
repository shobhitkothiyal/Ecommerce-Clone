import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import { Avatar, CardHeader } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";

const CustomersTable = ({ customers = [] }) => {
  const navigate = useNavigate();

  const recentCustomers = customers.slice(0, 5);

  return (
    <Card
      sx={{
        backgroundColor: "#18181b", // Zinc-900
        color: "white",
        borderRadius: 2,
        boxShadow: "none",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <CardHeader
        title="New Customers"
        sx={{
          pt: 2,
          alignItems: "center",
          "& .MuiCardHeader-action": { mt: 0.6 },
          "& .MuiCardHeader-title": { color: "white" },
        }}
        action={
          <Typography
            onClick={() => navigate("/customers")}
            variant="caption"
            sx={{
              color: "#818cf8", // Indigo-400
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
            fontWeight: 700,
            letterSpacing: "0.3px !important",
          },
        }}
      />

      <TableContainer>
        <Table sx={{ minWidth: 390 }} aria-label="new customers">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: "gray" }}>
                Image
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "gray" }}>
                Email
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {recentCustomers.length > 0 ? (
              recentCustomers.map((item, index) => (
                <TableRow
                  hover
                  key={index}
                  sx={{
                    "&:last-of-type td, &:last-of-type th": { border: 0 },
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.05) !important",
                    },
                  }}
                  onClick={() => navigate("/customers")}
                >
                  <TableCell>
                    <Avatar
                      alt={item.name}
                      src={item.image || "/default-avatar.png"}
                      sx={{ width: 42, height: 42 }}
                    />
                  </TableCell>

                  <TableCell sx={{ fontSize: ".9rem", color: "gray.300" }}>
                    {item.email}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} sx={{ textAlign: "center", py: 3 }}>
                  <Typography variant="body2" color="gray">
                    No customers found.
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

export default CustomersTable;