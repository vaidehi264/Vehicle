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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <BrandLogo size="sm" link="/admin/dashboard" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-500 hover:text-slate-800 p-1 rounded-lg"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Tag */}
        <div className="px-5 py-3 bg-orange-50 border-b border-orange-100 flex items-center gap-2 text-xs font-semibold text-orange-700">
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
                      ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
        <div className="p-4 border-t border-slate-200 space-y-2">
          <button
            onClick={handleResetData}
            type="button"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-orange-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <FaRedo className="w-3 h-3 text-orange-600" />
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
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name || "Amit Kumar"}</p>
                <p className="text-[10px] text-orange-600 truncate font-semibold">Super Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <FaSignOutAlt className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg bg-slate-100 border border-slate-200"
            >
              <FaBars className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Control Panel & System Governance
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            >
              View Public Site ↗
            </Link>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-600 font-medium">System Online</span>
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
