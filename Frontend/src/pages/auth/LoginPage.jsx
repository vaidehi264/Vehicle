import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import BrandLogo from "../../components/common/BrandLogo";
import {
  FaUser,
  FaWrench,
  FaShieldAlt,
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

export const LoginPage = () => {
  const { login, demoLogin, demoAccounts } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState("user"); // "user" | "mechanic" | "admin"
  const [email, setEmail] = useState("user@vvcars.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError("");
    if (newRole === "user") {
      setEmail("user@vvcars.com");
    } else if (newRole === "mechanic") {
      setEmail("mechanic@vvcars.com");
    } else if (newRole === "admin") {
      setEmail("admin@vvcars.com");
    }
    setPassword("password123");
  };

  const redirectAfterLogin = (userRole) => {
    const from = location.state?.from?.pathname;
    if (from && !from.includes("/login")) {
      navigate(from, { replace: true });
      return;
    }
    if (userRole === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else if (userRole === "mechanic") {
      navigate("/mechanic/dashboard", { replace: true });
    } else {
      navigate("/user/dashboard", { replace: true });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(email, password, role);
      setLoading(false);
      if (res.success) {
        addToast(`Signed in as ${res.user.name} (${res.user.role})`, "success");
        redirectAfterLogin(res.user.role);
      } else {
        setError("Invalid credentials or role selection.");
      }
    }, 400);
  };

  const handleQuickDemo = (selectedRole) => {
    const res = demoLogin(selectedRole);
    if (res.success) {
      addToast(`Logged in as Demo ${selectedRole.toUpperCase()}: ${res.user.name}`, "success");
      redirectAfterLogin(res.user.role);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] relative flex flex-col justify-center items-center p-4 sm:p-6 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center text-center z-10">
        <BrandLogo size="lg" link="/" />
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 p-6 sm:p-8 z-10 backdrop-blur-md">
        {/* Top Tab Switcher: Login / Register */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200">
          <button
            type="button"
            className="py-2.5 text-sm font-bold rounded-lg transition-all bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm"
          >
            Login
          </button>
          <Link
            to="/register"
            className="py-2.5 text-sm font-semibold rounded-lg text-slate-600 hover:text-slate-900 transition-all text-center flex items-center justify-center"
          >
            Register
          </Link>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "user", label: "User", icon: FaUser },
              { id: "mechanic", label: "Mechanic", icon: FaWrench },
              { id: "admin", label: "Admin", icon: FaShieldAlt },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = role === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleRoleChange(item.id)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-orange-50 border-orange-500 text-orange-700 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-orange-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In as {role.toUpperCase()}</span>
                <FaArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Quick Demo Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/50 p-5 mt-4 z-10 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            1-Click Demo Logins
          </p>
          <span className="text-[11px] text-slate-400">Auto-fill & Enter</span>
        </div>

        <div className="space-y-2.5">
          {/* User Demo */}
          <div
            onClick={() => handleQuickDemo("user")}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-orange-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <FaUser className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                  {demoAccounts.user.name}
                </p>
                <p className="text-[11px] text-slate-500">{demoAccounts.user.email}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
              Demo User →
            </span>
          </div>

          {/* Mechanic Demo */}
          <div
            onClick={() => handleQuickDemo("mechanic")}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-orange-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
                <FaWrench className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                  {demoAccounts.mechanic.name}
                </p>
                <p className="text-[11px] text-slate-500">{demoAccounts.mechanic.email}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg">
              Demo Mechanic →
            </span>
          </div>

          {/* Admin Demo */}
          <div
            onClick={() => handleQuickDemo("admin")}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-orange-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center">
                <FaShieldAlt className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                  {demoAccounts.admin.name}
                </p>
                <p className="text-[11px] text-slate-500">{demoAccounts.admin.email}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg">
              Demo Admin →
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500 z-10">
        <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors">
          ← Return to Public Homepage
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
