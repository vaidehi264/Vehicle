import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { storageService } from "../../utils/storage";
import {
  FaUserCog,
  FaShieldAlt,
  FaSave,
  FaRedo,
  FaSignOutAlt,
  FaBell,
  FaMoon,
  FaCheckCircle,
} from "react-icons/fa";

export const AdminSettings = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: currentUser?.name || "Amit Kumar",
    email: currentUser?.email || "admin@autoserve.com",
    phone: currentUser?.phone || "+91 99000 11223",
  });

  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    bookingSms: true,
    autoAssignBay: false,
    soundNotifications: true,
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    addToast("Administrator profile details updated successfully", "success");
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure? This will reset all demo users, bookings, mechanics, and services to factory values.")) {
      storageService.resetAll();
      addToast("Demo state reinitialized to factory defaults", "info");
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleLogout = () => {
    logout();
    addToast("Logged out from Administrator session", "info");
    navigate("/login");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#182234] border border-slate-750/70 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Administrator Profile & Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System administration parameters, administrator credentials, notification hooks, and demo sandbox.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FaSignOutAlt className="w-3.5 h-3.5" />
          <span>Exit Admin Session</span>
        </button>
      </div>

      {/* Profile Form */}
      <div className="bg-[#182234] border border-slate-750/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
          <img
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120"}
            alt="Admin"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500"
          />
          <div>
            <h3 className="text-base font-bold text-white">{currentUser?.name || "Amit Kumar"}</h3>
            <p className="text-xs text-orange-400 font-semibold">Master Administrator Role</p>
            <p className="text-[11px] text-slate-500">Security Access Level 5</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FaSave className="w-3.5 h-3.5" />
              <span>Save Admin Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preferences & Sandbox Toggles */}
      <div className="bg-[#182234] border border-slate-750/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <FaBell className="text-orange-400" /> Platform Preferences
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <p className="font-bold text-white">Email Booking Dispatch Alerts</p>
              <p className="text-slate-400 text-[11px]">Send instant notification when a customer submits a booking</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.emailAlerts}
              onChange={(e) => setPreferences({ ...preferences, emailAlerts: e.target.checked })}
              className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <p className="font-bold text-white">Customer SMS Status Updates</p>
              <p className="text-slate-400 text-[11px]">Send SMS when vehicle transitions from Accepted to In Progress</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.bookingSms}
              onChange={(e) => setPreferences({ ...preferences, bookingSms: e.target.checked })}
              className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <p className="font-bold text-white">Auto-Assign Next Available Master Tech</p>
              <p className="text-slate-400 text-[11px]">Automatically assign highest-rated mechanic on new booking</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.autoAssignBay}
              onChange={(e) => setPreferences({ ...preferences, autoAssignBay: e.target.checked })}
              className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Sandbox Data Reset Area */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-rose-400">Demonstration State Reset</h4>
            <p className="text-xs text-slate-400">Restore all mock databases back to initial factory values.</p>
          </div>

          <button
            onClick={handleResetData}
            type="button"
            className="px-4 py-2 bg-slate-900 hover:bg-rose-500/10 border border-slate-750 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <FaRedo className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

