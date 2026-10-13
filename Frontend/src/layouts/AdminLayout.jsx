import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { storageService } from "../utils/storage";
import BrandLogo from "../components/common/BrandLogo";
import {
  FaChartPie,
  FaUsers,
  FaUserCog,
  FaWrench,
  FaCalendarCheck,
  FaChartBar,
  FaStar,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaRedo,
  FaBell,
  FaSearch,
  FaShieldAlt,
} from "react-icons/fa";

export const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const { addToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: FaChartPie },
    { name: "Users", path: "/admin/users", icon: FaUsers },
    { name: "Mechanics", path: "/admin/mechanics", icon: FaUserCog },
    { name: "Services", path: "/admin/services", icon: FaWrench },
    { name: "Bookings", path: "/admin/bookings", icon: FaCalendarCheck },
    { name: "Reports & Analytics", path: "/admin/reports", icon: FaChartBar },
    { name: "Customer Reviews", path: "/admin/reviews", icon: FaStar },
    { name: "Settings & Profile", path: "/admin/settings", icon: FaCog },
  ];

  const handleResetData = () => {
    if (window.confirm("Reset all mock data back to factory defaults?")) {
      storageService.resetAll();
      addToast("Demonstration data reset to initial values", "info");
      window.location.reload();
    }
  };

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully", "info");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-[#101827] border-r border-slate-800/80 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <BrandLogo size="sm" link="/admin/dashboard" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Tag */}
        <div className="px-5 py-3 bg-slate-900/60 border-b border-slate-800/50 flex items-center gap-2 text-xs font-semibold text-orange-400">
          <FaShieldAlt className="w-3.5 h-3.5" />
          <span>ADMINISTRATOR PORTAL</span>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scroll">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 font-semibold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Demo reset & quick action */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={handleResetData}
            type="button"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-orange-400 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <FaRedo className="w-3 h-3 text-orange-500" />
            <span>Reset Demo Data</span>
          </button>

          {/* User profile block */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"}
                alt="Admin"
                className="w-9 h-9 rounded-xl object-cover border border-orange-500/40 shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name || "Amit Kumar"}</p>
                <p className="text-[10px] text-orange-400 truncate font-semibold">Super Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <FaSignOutAlt className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#0e1626]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg bg-slate-800 border border-slate-700"
            >
              <FaBars className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Control Panel & System Governance
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
            >
              View Public Site ↗
            </Link>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">System Online</span>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

