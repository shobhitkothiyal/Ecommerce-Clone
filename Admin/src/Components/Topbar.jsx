import React from "react";
import { Search, Bell, Mail, User, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/Auth/Action";

const Topbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <header className="h-[65px] bg-zinc-900 border-b border-white/5 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left Side - Hamburger + Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-400 hover:text-white lg:hidden"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 lg:w-10 lg:h-10 bg-linear-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-500/20"
            style={{
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            <span className="text-lg lg:text-xl font-bold text-white">UP</span>
          </div>
          <h1 className="text-base lg:text-lg font-bold text-white tracking-wide hidden sm:block">
            UPTOWNIE
          </h1>
        </div>
      </div>

      {/* Middle - Search (Hidden on mobile) */}
      <div className="relative w-96 hidden md:block">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
        />
      </div>

      {/* Right Side - Stats + Icons */}
      <div className="flex items-center gap-3 lg:gap-6">
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="relative cursor-pointer">
            <Mail size={20} className="text-gray-400 hover:text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
              0
            </span>
          </div>

          <div className="relative cursor-pointer">
            <Bell size={20} className="text-gray-400 hover:text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              0
            </span>
          </div>

          <User
            size={20}
            className="text-gray-400 hover:text-white cursor-pointer"
          />

          {localStorage.getItem("jwt") ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
            >
              <User size={16} />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;