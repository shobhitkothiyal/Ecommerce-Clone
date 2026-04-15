import React from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  Plus,
  FileText,
  ShoppingBag,
  Ticket,
  MessageSquare,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ closeSidebar }) => {
  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/",
    },
    { label: "Products", icon: <Package size={20} />, path: "/products" },
    { label: "Customers", icon: <Users size={20} />, path: "/customers" },
    { label: "Orders", icon: <ShoppingBag size={20} />, path: "/orders" },
    { label: "Queries", icon: <MessageSquare size={20} />, path: "/queries" },
    { label: "Blogs", icon: <FileText size={20} />, path: "/blogs" },
    { label: "Add Product", icon: <Plus size={20} />, path: "/add-product" },

    {
      label: "Create Coupon",
      icon: <Ticket size={20} />,
      path: "/create-coupon",
    },
  ];

  return (
    <aside className="w-[230px] h-full bg-zinc-900 border-r border-white/5 flex flex-col">
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar} // Close sidebar on mobile when link clicked
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 text-gray-400 transition hover:bg-white/5 hover:text-white ${
                isActive
                  ? "bg-white/5 border-l-4 border-indigo-500 text-white"
                  : ""
              }`
            }
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom avatar */}
      <div className="p-4 border-t border-white/5">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-lg font-semibold text-white">VN</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;