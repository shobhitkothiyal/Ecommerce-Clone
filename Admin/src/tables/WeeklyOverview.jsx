// src/tables/SalesOverview.jsx  (Dark Theme)
import React, { useState, useMemo } from "react";
import Icon from "@mdi/react";
import { mdiDotsVertical } from "@mdi/js";
import ReactApexCharts from "react-apexcharts";

const SalesOverview = ({ overview = {} }) => {
  const [activeTab, setActiveTab] = useState("weekly");

  const weeklySales = Array.isArray(overview.weeklySales)
    ? overview.weeklySales
    : [];
  const monthlySales = Array.isArray(overview.monthlySales)
    ? overview.monthlySales
    : [];
  const yearlySales = Array.isArray(overview.yearlySales)
    ? overview.yearlySales
    : [];

  const chartData = {
    weekly: weeklySales,
    monthly: monthlySales,
    yearly: yearlySales,
  };

  const currentSeries = chartData[activeTab] || [];

  const options = useMemo(() => {
    const base = {
      chart: {
        id: "sales-line-chart",
        toolbar: { show: false },
        animations: { enabled: true },
        zoom: { enabled: false },
        background: "transparent",
        foreColor: "#9ca3af", // Gray-400 for text
      },
      dataLabels: {
        enabled: false,
      },
      stroke: { curve: "smooth", width: 3 },
      markers: { size: 5, hover: { sizeOffset: 3 } },
      tooltip: {
        theme: "dark", // Dark tooltip
        style: {
          fontSize: "13px",
        },
        y: {
          formatter: (val) =>
            val === undefined || val === null ? "-" : `${val}`,
        },
      },
      grid: { borderColor: "#3f3f46", strokeDashArray: 4 }, // Zinc-700
      colors: ["#818cf8"], // Indigo-400
      xaxis: {
        labels: {
          show: true,
          trim: true,
          style: {
            colors: "#9ca3af",
            fontSize: "12px",
          },
        },
        axisBorder: { color: "#3f3f46" },
        axisTicks: { color: "#3f3f46" },
      },
      yaxis: {
        labels: {
          formatter: (value) =>
            value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`,
          style: {
            colors: "#9ca3af",
            fontSize: "12px",
          },
        },
      },
      legend: { show: false },
      responsive: [
        {
          breakpoint: 640,
          options: { chart: { height: 220 } },
        },
      ],
    };

    const categories =
      activeTab === "yearly"
        ? [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ]
        : activeTab === "monthly"
        ? Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return { ...base, xaxis: { ...base.xaxis, categories } };
  }, [activeTab]);

  // Performance text safety
  const getPerformanceText = () => {
    const data = currentSeries;
    if (!data || data.length < 2)
      return "Sales performance data is insufficient to evaluate trends.";
    const previous = Number(data[data.length - 2]) || 0;
    const current = Number(data[data.length - 1]) || 0;
    if (previous === 0)
      return "Not enough historical data to compute percentage change.";
    const diff = current - previous;
    const percentage = ((diff / Math.abs(previous)) * 100).toFixed(1);
    const sign = diff >= 0 ? "+" : "";
    return `Sales have ${
      diff >= 0 ? "increased" : "decreased"
    } by ${sign}${percentage}% compared to the previous period.`;
  };

  const percentChangeDisplay = (() => {
    if (!currentSeries || currentSeries.length < 2) return "N/A";
    const prev = Number(currentSeries.at(-2)) || 0;
    const cur = Number(currentSeries.at(-1)) || 0;
    if (prev === 0) return "N/A";
    return `${Math.round(((cur - prev) / Math.abs(prev)) * 100)}%`;
  })();

  return (
    <div className="bg-zinc-900 rounded-xl border border-white/5 shadow-sm hover:border-white/10 transition transform-gpu">
      {/* Header */}
      <div className="flex items-start justify-between px-6 py-5">
        <div>
          <h3 className="text-lg font-semibold text-white">Sales Overview</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="more"
            className="text-gray-400 hover:text-white p-1 rounded"
            title="More"
          >
            <Icon path={mdiDotsVertical} size={0.9} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pb-2">
        <div
          role="tablist"
          aria-label="Sales tabs"
          className="inline-flex rounded-md bg-zinc-800 p-1 border border-white/5"
        >
          {["weekly", "monthly", "yearly"].map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium px-4 py-1.5 rounded-md focus:outline-none transition ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-4">
        <ReactApexCharts
          type="line"
          height={280}
          options={options}
          series={[{ name: "Sales", data: currentSeries }]}
        />
      </div>

      {/* Footer: percent and detail */}
      <div className="px-6 pb-6 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/5 mt-2">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-semibold text-white">
            {percentChangeDisplay}
          </div>
          <div className="text-sm text-gray-400">{getPerformanceText()}</div>
        </div>

        <div className="w-full sm:w-auto">
          <button className="mt-2 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;