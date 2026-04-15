// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import React from "react";
// ** Icons Imports
import Icon from "@mdi/react";
import { mdiDotsVertical } from "@mdi/js";

// ** Custom Components Imports
import ReactApexCharts from "react-apexcharts";

const SalesOverTime = () => {
  // ** Hook
  const theme = useTheme();

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: true,
        columnWidth: "40%",
        endingShape: "rounded",
        startingShape: "rounded",
      },
    },
    stroke: {
      width: 2,
      colors: ["#18181b"], // Match card bg
    },
    legend: { show: false },
    grid: {
      strokeDashArray: 7,
      borderColor: "#3f3f46",
      padding: {
        top: -1,
        right: 0,
        left: -12,
        bottom: 5,
      },
    },
    dataLabels: { enabled: false },
    colors: [
      "#3f3f46", // Inactive (Zinc-700)
      "#3f3f46",
      "#3f3f46",
      "#818cf8", // Active (Indigo-400)
      "#3f3f46",
      "#3f3f46",
    ],
    states: {
      hover: {
        filter: { type: "none" },
      },
      active: {
        filter: { type: "none" },
      },
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      tickPlacement: "on",
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        style: { colors: "#9ca3af" },
        offsetX: -17,
        formatter: (value) =>
          `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}k`,
      },
    },
    tooltip: {
      theme: "dark",
    },
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
        title="Sales Over Time"
        titleTypographyProps={{
          sx: {
            lineHeight: "0.5rem !important",
            letterSpacing: "0.15px !important",
            color: "white",
          },
        }}
        action={
          <IconButton
            size="small"
            aria-label="settings"
            className="card-more-options"
            sx={{ color: "gray" }}
          >
            <Icon path={mdiDotsVertical} size={0.9} />
          </IconButton>
        }
      />
      <CardContent
        sx={{ "& .apexcharts-xcrosshairs.apexcharts-active": { opacity: 0 } }}
      >
        <ReactApexCharts
          type="bar"
          height={274}
          options={options}
          series={[{ data: [37, 57, 45, 75, 57, 40, 65] }]}
        />
        <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            sx={{ mr: 4, color: "white", fontWeight: "bold" }}
          >
            45%
          </Typography>
          <Typography variant="body2" sx={{ color: "gray" }}>
            Your sales performance is 45% 😎 better compared to last month
          </Typography>
        </Box>
        <Button
          fullWidth
          variant="contained"
          sx={{ bgcolor: "#4f46e5", "&:hover": { bgcolor: "#4338ca" } }}
        >
          Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default SalesOverTime;