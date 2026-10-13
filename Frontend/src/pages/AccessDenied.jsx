import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaShieldAlt, FaArrowLeft, FaHome } from "react-icons/fa";

export const AccessDenied = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const getAuthorizedDashboard = () => {
    if (!currentUser) return "/login";
    if (currentUser.role === "admin") return "/admin/dashboard";
    if (currentUser.role === "mechanic") return "/mechanic/dashboard";
    return "/user/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mb-6 shadow-2xl shadow-rose-500/20">
        <FaShieldAlt className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 mb-3">
        403 — Unauthorized Role Access
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
        Access Denied
      </h1>

      <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
        Your current session is authenticated as{" "}
        <span className="text-orange-400 font-bold uppercase">
          {currentUser?.role || "Guest"}
        </span>
        . This route requires elevated privileges restricted to a different role.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FaArrowLeft className="w-3 h-3" /> Go Back
        </button>

        <Link
          to={getAuthorizedDashboard()}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
        >
          <FaHome className="w-3.5 h-3.5" /> Return to My Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;

