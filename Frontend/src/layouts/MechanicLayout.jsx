import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import BrandLogo from "../components/common/BrandLogo";
import {
  FaTachometerAlt,
  FaClipboardList,
  FaTools,
  FaHistory,
  FaCalendarAlt,
  FaWallet,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaStar,
} from "react-icons/fa";

export const MechanicLayout = () => {
  const { currentUser, logout, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const isAvailable = currentUser?.availability !== "Busy";

  const toggleAvailability = () => {
    const newStatus = isAvailable ? "Busy" : "Available";
    updateProfile({ availability: newStatus });
    addToast(`Duty status updated to ${newStatus}`, newStatus === "Available" ? "success" : "info");
  };

  const navItems = [
    { name: "Dashboard", path: "/mechanic/dashboard", icon: FaTachometerAlt },
    { name: "Service Requests", path: "/mechanic/requests", icon: FaClipboardList },
    { name: "Active Job Manager", path: "/mechanic/jobs", icon: FaTools },
    { name: "Service History", path: "/mechanic/history", icon: FaHistory },
    { name: "Availability Schedule", path: "/mechanic/availability", icon: FaCalendarAlt },
    { name: "Earnings & Metrics", path: "/mechanic/earnings", icon: FaWallet },
    { name: "Profile & Credentials", path: "/mechanic/profile", icon: FaUser },
  ];

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
          <BrandLogo size="sm" link="/mechanic/dashboard" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-500 hover:text-slate-800 p-1 rounded-lg"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Mechanic Tag */}
        <div className="px-5 py-3 bg-sky-50 border-b border-sky-100 flex items-center justify-between text-xs font-semibold">
          <span className="text-sky-700 flex items-center gap-1.5">
            <FaTools className="w-3.5 h-3.5" /> MASTER TECHNICIAN
          </span>
          <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
            <FaStar className="w-3 h-3 text-amber-500" /> {currentUser?.rating || "4.9"}
          </span>
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

        {/* User profile block */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100"}
                alt="Mechanic"
                className="w-9 h-9 rounded-xl object-cover border border-sky-500/40 shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name || "Suresh Verma"}</p>
                <p className="text-[10px] text-sky-600 truncate font-semibold">{currentUser?.specialization || "Lead Mechanic"}</p>
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
              Technician Workshop Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick availability switch button */}
            <button
              onClick={toggleAvailability}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isAvailable
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                  : "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span>Status: {isAvailable ? "Ready for Jobs" : "Bay Busy"}</span>
            </button>

            <Link
              to="/"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            >
              Public Site ↗
            </Link>
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

export default MechanicLayout;
