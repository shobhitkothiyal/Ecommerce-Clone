import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden relative">
      {/* Fixed Topbar */}
      <div className="shrink-0 z-20 w-full">
        <Topbar toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar (Desktop: Fixed, Mobile: Absolute/Overlay) */}
        <div
          className={`shrink-0 h-full absolute lg:static left-0 top-0 z-10 transition-transform duration-300 lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar closeSidebar={closeSidebar} />
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-0 lg:hidden"
            onClick={closeSidebar}
          ></div>
        )}

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 w-full relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;