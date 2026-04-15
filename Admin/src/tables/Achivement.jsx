// Achivement.jsx
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import React from "react";

// Background triangle image
const TriangleImg = styled("img")(() => ({
  position: "absolute",
  right: -5,
  bottom: -5,
  height: 170, // Increased size for better background coverage
  opacity: 0.15,
  pointerEvents: "none",
  zIndex: 0,
}));

// Trophy image
const TrophyImg = styled("img")(() => ({
  position: "absolute",
  right: 36, // Moved slightly left
  bottom: 20,
  height: 98, // Slightly larger
  opacity: 1,
  pointerEvents: "none",
  zIndex: 0,
}));

const Achivement = ({ sales }) => {
  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        backgroundColor: "#18181b", // Zinc-900
        color: "#fff", // White Text
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "none",
        "&:hover": { border: "1px solid rgba(255,255,255,0.1)" },
      }}
    >
      <CardContent sx={{ position: "relative", zIndex: 2, p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
          UPTOWNIE
        </Typography>

        <Typography variant="body2" sx={{ mb: 1, color: "#9ca3af" }}>
          {" "}
          {/* Gray-400 */}
          Congratulations 🥳
        </Typography>

        <Typography
          variant="h5"
          sx={{
            my: 2.5,
            fontWeight: 900,
            color: "#818cf8", // Indigo-400
          }}
        >
          {sales
            ? `${Number(sales).toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })} INR`
            : "Loading..."}
        </Typography>

        <Button
          size="small"
          variant="contained"
          sx={{
            textTransform: "none",
            bgcolor: "#4f46e5",
            "&:hover": { bgcolor: "#4338ca" },
          }}
        >
          View Sales
        </Button>
      </CardContent>

      {/* Decorative images */}
      <TriangleImg
        alt="triangle background"
        src={`https://imgs.search.brave.com/Sx35eYx2n00lyBFY90Vw1iIqepmeA2mpySpvBaaq9R0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDgv/OTM2LzMwMC9zbWFs/bC9nbG93LWdvbGRl/bi10cmlhbmdsZS10/cmFuc3BhcmVudC1i/YWNrZ3JvdW5kLXBu/Zy5wbmc`}
      />
      <TrophyImg
        alt="trophy"
        src="https://imgs.search.brave.com/VsIuNNAZdzkXSD8XPTcPwL05YzScc6ykrJso7FJMcfk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzIv/OTUyLzg3NS9zbWFs/bC9nb2xkZW4tdHJv/cGh5LW9uLWEtcGVk/ZXN0YWwtaXNvbGF0/ZWQtb24tdHJhbnNw/YXJlbnQtYmFja2dy/b3VuZC0zZC1yZW5k/ZXJpbmctcG5nLnBu/Zw"
      />
    </Card>
  );
};

export default Achivement;