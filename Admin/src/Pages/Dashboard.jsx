// src/views/Dashboard.jsx
import React, { useEffect } from "react";
import AdminPannel from "../Styles/AdminPannelWrapper";
import Achivement from "../tables/Achivement";
import MonthlyOverview from "../tables/MonthlyOverView";
import SalesOverview from "../tables/WeeklyOverview";
import TotalEarning from "../tables/TotalEarning";
import { CardStatsVertical, customTheme } from "../Theme/customeThem";
import CustomersTable from "../tables/CustomersTable";
import { ThemeProvider } from "@mui/material/styles";
import "../Styles/Admin.css";
import "../Styles/AdminPannel.css";
import RecentlyAddeddProducts from "../tables/RecentlyAddeddProducts";
import SalesOverTime from "../tables/SalesOverTime";
import RecentOrders from "../tables/RecentOrders";
import { Card, CardContent, Typography } from "@mui/material";
import Icon from "@mdi/react";
import {
  mdiBriefcaseVariantOutline,
  mdiHelpCircleOutline,
  mdiPoll,
  mdiCurrencyUsd,
} from "@mdi/js";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardOverview } from "../Redux/Admin/Orders/Action";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { overview, loading, error } = useSelector(
    (state) => state.adminsOrder || {}
  );

  useEffect(() => {
    dispatch(fetchDashboardOverview());
  }, [dispatch]);

  /* 
     NOTE: To fully "dark theme" the components imported from MUI or custom tables (like Achivement, MonthlyOverview),
     those components' internal styles might typically need updating too. 
     However, since I cannot see all those files at once, I will assume a "Dark Wrapper" approach 
     where possible, or update the main containers to at least provide the dark backdrop.
     The containers below are updated to bg-zinc-900 / border-white/5 for the dark look.
  */

  return (
    <div className="bg-black min-h-screen text-gray-200">
      <ThemeProvider theme={customTheme}>
        <AdminPannel>
          <div className="container mx-auto px-3 sm:px-4 py-4 max-w-[1600px] ">
            {/* Row 1 - Achievement & Monthly Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-1">
                <div className="bg-zinc-900 rounded-2xl shadow-xl border border-white/5 hover:border-white/10 transition-all duration-300 h-full overflow-hidden">
                  <div className="p-0 h-full">
                    {/* Assuming Achivement component can adapt or sits in this dark container */}
                    <Achivement sales={overview?.totalRevenue} />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-zinc-900 rounded-2xl shadow-xl border border-white/5 hover:border-white/10 transition-all duration-300 h-full overflow-hidden">
                  <div className="p-0 h-full">
                    <MonthlyOverview overview={overview} />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 - Sales Overview, Total Earning & Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* ─── Sales Overview ─────────────────────────────── */}
              <div className="h-full">
                <div className="bg-zinc-900 rounded-2xl shadow-xl border border-white/5 hover:border-white/10 transition-all duration-300 h-auto">
                  <div className="p-4 h-full">
                    <SalesOverview overview={overview} />
                  </div>
                </div>
              </div>

              {/* ─── Total Earnings ─────────────────────────────── */}
              <div className="h-full">
                <div className="bg-zinc-900 rounded-2xl shadow-xl border border-white/5 hover:border-white/10 transition-all duration-300 h-auto">
                  <div className="p-4 h-full">
                    <TotalEarning
                      amount={overview?.totalRevenue}
                      lastYearAmount={overview?.lastYearRevenue}
                      topCategories={overview?.topCategories || []}
                    />
                  </div>
                </div>
              </div>

              {/* ─── Key Metrics ─────────────────────────────── */}
              <div className="md:col-span-2 lg:col-span-1 h-full">
                <div className="bg-zinc-900 rounded-2xl shadow-xl border border-white/5 hover:border-white/10 transition-all duration-300 h-auto">
                  <div className="p-6 h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-4 text-white">
                      Key Metrics
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                      <CardStatsVertical
                        stats={`$${overview?.totalProfit || 0}`}
                        icon={<Icon path={mdiPoll} size={0.85} />}
                        color="success"
                        trendNumber="+42%"
                        title="Total Profit"
                        subtitle="Weekly Profit"
                      />

                      <CardStatsVertical
                        stats={`$${overview?.totalRefund || 0}`}
                        title="Refunds"
                        trend="negative"
                        color="secondary"
                        trendNumber="-15%"
                        subtitle="Past Month"
                        icon={<Icon path={mdiCurrencyUsd} size={0.85} />}
                      />

                      <CardStatsVertical
                        stats={`${overview?.weeklyOrderCount || 0}`}
                        trend="positive"
                        trendNumber="+12%"
                        title="New Orders"
                        subtitle="Weekly Orders"
                        icon={
                          <Icon path={mdiBriefcaseVariantOutline} size={0.85} />
                        }
                      />

                      <CardStatsVertical
                        stats={`${overview?.totalQueries || 0}`}
                        color="warning"
                        trend="neutral"
                        trendNumber="--"
                        subtitle="Last Week"
                        title="Sales Queries"
                        icon={<Icon path={mdiHelpCircleOutline} size={0.85} />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3 - Customers & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-1">
                <div className="bg-zinc-900 rounded-2xl shadow-xl border border-white/5 hover:border-white/10 transition-all duration-300 h-full overflow-hidden">
                  <div className="p-0">
                    <CustomersTable customers={overview?.recentUsers || []} />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-zinc-900 rounded-2xl shadow-xl border border-white/5 hover:border-white/10 transition-all duration-300 h-full overflow-hidden">
                  <div className="p-0">
                    <RecentOrders orders={overview?.recentOrders || []} />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4 - Recent Products & Sales Over Time */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <div className="bg-zinc-900 rounded-2xl shadow-xl border border-white/5 hover:border-white/10 transition-all duration-300 h-full overflow-hidden">
                  <div className="p-0">
                    <RecentlyAddeddProducts
                      products={overview?.recentProducts || []}
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-zinc-900 rounded-2xl shadow-xl border border-white/5 hover:border-white/10 transition-all duration-300 h-full overflow-hidden">
                  <div className="p-4">
                    <SalesOverTime />
                  </div>
                </div>
              </div>
            </div>

            {/* Full width table */}
            <div className="w-full">
              <div className="bg-zinc-900 rounded-2xl shadow-xl border border-white/5 hover:border-white/10 transition-all duration-300 h-full overflow-hidden">
                <div className="p-0">
                  <CustomersTable customers={overview?.recentUsers || []} />
                </div>
              </div>
            </div>
          </div>
        </AdminPannel>
      </ThemeProvider>
    </div>
  );
};

export default Dashboard;