// src/them/customeThem.jsx
import React from "react";
import { createTheme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

/* -------------------------------
   THEMES (Dark by default now)
   ------------------------------- */
const customTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#9155FD" },
    secondary: { main: "#f48fb1" },
    white: { main: "#ffffff" },
    orange: { main: "#ffdb0f" },
    background: { default: "#000000", paper: "#18181b" }, // Zinc-900
    text: { primary: "#ffffff", secondary: "#9ca3af" }, // White / Gray-400
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: "none", // Avoid weird MUI overlays
          backgroundColor: "#18181b",
          border: "1px solid rgba(255,255,255,0.05)",
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#9155FD" },
    secondary: { main: "#f48fb1" },
    background: { default: "#0b1020", paper: "#18181b" },
    text: { primary: "#ffffff", secondary: "#9ca3af" },
  },
  shape: { borderRadius: 12 },
});

const customerTheme = createTheme({
  palette: {
    mode: "dark", // Forced dark
    primary: { main: "#9155FD" },
    secondary: { main: "#f48fb1" },
    white: { main: "#fff" },
    orange: { main: "#ffdb0f" },
    background: { default: "#000000", paper: "#18181b" },
    text: { primary: "#ffffff", secondary: "#9ca3af" },
  },
  shape: { borderRadius: 12 },
});

/* -----------------------------------------------------
   CardStatsVertical component (theme-aware)
   ----------------------------------------------------- */
export const CardStatsVertical = ({
  stats = "",
  title = "",
  subtitle = "",
  icon = null,
  color = "primary",
  trend = "neutral",
  trendNumber = "",
}) => {
  const theme = useTheme();

  const trendColor =
    trend === "positive"
      ? theme.palette.success?.main || "#16a34a"
      : trend === "negative"
      ? theme.palette.error?.main || "#dc2626"
      : theme.palette.text.secondary;

  const avatarBg =
    (theme.palette[color] && theme.palette[color].main) ||
    theme.palette.primary.main;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        p: 2,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          mr: 2,
          width: 44,
          height: 44,
          bgcolor: avatarBg,
          boxShadow: 2,
          color: "#fff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Avatar>

      <CardContent
        sx={{ p: 0, "&:last-child": { pb: 0 }, flex: 1, minWidth: 0 }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: theme.palette.text.primary }}
        >
          {stats}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mt: 0.25,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            mt: 0.6,
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: trendColor, fontWeight: 700 }}
          >
            {trendNumber}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              whiteSpace: "nowrap",
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export { customTheme, darkTheme, customerTheme };
export default customTheme;