// src/tables/MonthlyOverView.jsx (Dark Theme)
import React from "react";
import Icon from "@mdi/react";
import {
  mdiTrendingUp,
  mdiCurrencyUsd,
  mdiDotsVertical,
  mdiCellphoneLink,
  mdiAccountOutline,
} from "@mdi/js";

const MonthlyOverview = ({ overview = {} }) => {
  const statsData = [
    {
      stats: overview?.totalOrders ?? 0,
      title: "Sales",
      color: "bg-blue-600",
      icon: mdiTrendingUp,
    },
    {
      stats: overview?.customerCount ?? 0,
      title: "Customers",
      color: "bg-green-600",
      icon: mdiAccountOutline,
    },
    {
      stats: overview?.productCount ?? 0,
      title: "Products",
      color: "bg-yellow-500",
      icon: mdiCellphoneLink,
    },
    {
      stats: overview?.totalRevenue ? `$${overview.totalRevenue}` : "$0",
      title: "Revenue",
      color: "bg-cyan-600",
      icon: mdiCurrencyUsd,
    },
  ];

  return (
    <div
      className="
        bg-zinc-900 rounded-xl shadow-lg py-8 px-6 border border-white/5
      "
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Monthly Overview</h2>
          <p className="text-sm text-gray-400 mt-1">
            <span className="font-semibold text-white">Total 48.5% growth</span>{" "}
            😎 this month
          </p>
        </div>

        <button className="text-gray-400 hover:text-white transition">
          <Icon path={mdiDotsVertical} size={0.9} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {statsData.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            {/* Icon Box */}
            <div
              className={`
                w-12 h-12 flex items-center justify-center 
                rounded-lg shadow-md text-white ${item.color}
              `}
            >
              <Icon path={item.icon} size={1} />
            </div>

            {/* Text */}
            <div>
              <p className="text-xs font-medium text-gray-400">{item.title}</p>
              <p className="text-lg font-bold text-white">{item.stats}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyOverview;