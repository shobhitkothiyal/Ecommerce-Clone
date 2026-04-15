// src/tables/TotalEarning.jsx
import React from "react";
import Icon from "@mdi/react";
import {
  mdiDotsVertical,
  mdiMenuUp,
  mdiCurrencyUsd,
  mdiChartLine,
} from "@mdi/js";

const TotalEarning = ({ overview = {} }) => {
  const earningsData = [
    {
      avatar: "/images/loading-gif.gif",
      title: "Total Revenue",
      subtitle: "Recent transaction",
      amount: `$${overview?.totalRevenue ?? 0}`,
      progress: 85,
      color: "text-indigo-400",
    },
    {
      avatar: "/images/loading-gif.gif",
      title: "Previous Year",
      subtitle: "Compared to last year",
      amount: "$0",
      progress: 60,
      color: "text-emerald-400",
    },
    {
      avatar: "/images/loading-gif.gif",
      title: "Active Orders",
      subtitle: "Currently processing",
      amount: `${overview?.totalOrders ?? 0}`,
      progress: 45,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="bg-zinc-900 rounded-xl shadow-lg border border-white/5 p-6 h-full font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">
            Total Earnings
          </h2>
          <div className="flex items-center gap-1 mt-1">
            <h3 className="text-3xl font-bold text-white">
              {overview?.totalRevenue ? `$${overview.totalRevenue}` : "$0"}
            </h3>
            <div className="flex items-center text-green-400 text-sm font-medium bg-green-400/10 px-1.5 py-0.5 rounded ml-2">
              <Icon path={mdiMenuUp} size={0.8} />
              <span>12%</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-1">Compared to last year</p>
        </div>
        <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition">
          <Icon path={mdiDotsVertical} size={1} />
        </button>
      </div>

      <div className="space-y-6">
        {earningsData.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-white/5">
              {/* Replaced img with Icon for better dark theme consistency if image is not transparent */}
              <Icon
                path={
                  index === 0
                    ? mdiCurrencyUsd
                    : index === 1
                    ? mdiChartLine
                    : mdiMenuUp
                }
                size={1.2}
                className={item.color}
              />
            </div>

            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white">{item.title}</h4>
              <p className="text-xs text-gray-400">{item.subtitle}</p>
            </div>

            <div className="text-right">
              <span className={`text-sm font-bold ${item.color}`}>
                {item.amount}
              </span>
              <div className="w-16 h-1.5 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    index === 0
                      ? "bg-indigo-500"
                      : index === 1
                      ? "bg-emerald-500"
                      : "bg-orange-500"
                  }`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalEarning;