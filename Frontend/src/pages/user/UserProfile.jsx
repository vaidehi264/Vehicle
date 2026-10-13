import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaSave,
  FaSignOutAlt,
  FaCamera,
  FaShieldAlt,
} from "react-icons/fa";

export const UserProfile = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: currentUser?.name || "Rahul Sharma",
    email: currentUser?.email || "user@autoserve.com",
    phone: currentUser?.phone || "+91 98765 43210",
    address: currentUser?.address || "B-402, Green Glen Layout, Bellandur, Bangalore",
    avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
        addToast("Profile picture preview loaded", "info");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    addToast("Customer account profile updated successfully", "success");
  };

  const handleLogout = () => {
    logout();
    addToast("Logged out from customer portal", "info");
    navigate("/login");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#182234] border border-slate-750/70 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Account Profile & Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal profile, doorstep vehicle pickup address, and communication numbers.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FaSignOutAlt className="w-3.5 h-3.5" />
          <span>Exit Session</span>
        </button>
      </div>

      {/* Profile Form Card */}
      <div className="bg-[#182234] border border-slate-750/70 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
          <div className="relative group">
            <img
              src={formData.avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-3xl object-cover border-2 border-orange-500 shadow-xl"
            />
            <label className="absolute inset-0 bg-black/60 rounded-3xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <FaCamera className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">Change</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg font-bold text-white">{formData.name}</h3>
            <p className="text-xs text-orange-400 font-semibold">{formData.email}</p>
            <p className="text-[11px] text-slate-400">Customer ID: {currentUser?.id || "usr-001"}</p>
            <p className="text-[10px] text-slate-500">Click avatar image to upload local photo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Default Doorstep Pickup / Residence Address
            </label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500 custom-scroll"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FaSave className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;

