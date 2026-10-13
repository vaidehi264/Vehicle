import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import BrandLogo from "../../components/common/BrandLogo";
import {
  FaUser,
  FaWrench,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaArrowRight,
  FaBriefcase,
  FaTools,
} from "react-icons/fa";

export const RegisterPage = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState("user"); // "user" | "mechanic"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    specialization: "General Automotive Repair",
    experience: "3 years",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError("Please fill in all contact information.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: role,
        specialization: formData.specialization,
        experience: formData.experience,
      });

      setLoading(false);
      if (res.success) {
        addToast(
          role === "mechanic"
            ? "Mechanic application registered! Awaiting admin verification."
            : "Account created successfully! Welcome to AutoServe.",
          "success"
        );
        if (role === "mechanic") {
          navigate("/mechanic/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] relative flex flex-col justify-center items-center p-4 sm:p-6 overflow-hidden py-12">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center text-center z-10">
        <BrandLogo size="lg" link="/" />
      </div>

      <div className="w-full max-w-lg bg-[#182234] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/60 p-6 sm:p-8 z-10 backdrop-blur-md">
        {/* Top Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-900/80 rounded-xl mb-6 border border-slate-800">
          <Link
            to="/login"
            className="py-2.5 text-sm font-semibold rounded-lg text-slate-400 hover:text-white transition-all text-center flex items-center justify-center"
          >
            Login
          </Link>
          <button
            type="button"
            className="py-2.5 text-sm font-bold rounded-lg transition-all bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20"
          >
            Register
          </button>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Register As
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                role === "user"
                  ? "bg-orange-500/20 border-orange-500 text-orange-400 shadow-md shadow-orange-500/10"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <FaUser className="w-4 h-4" />
              <span>Vehicle Owner</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("mechanic")}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                role === "mechanic"
                  ? "bg-sky-500/20 border-sky-500 text-sky-400 shadow-md shadow-sky-500/10"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <FaWrench className="w-4 h-4" />
              <span>Certified Mechanic</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={role === "mechanic" ? "e.g. Ramesh Kumar" : "e.g. Neha Verma"}
                required
                className="w-full bg-slate-900/90 border border-slate-750 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-slate-900/90 border border-slate-750 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 00000"
                  required
                  className="w-full bg-slate-900/90 border border-slate-750 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Mechanic specific fields */}
          {role === "mechanic" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-sky-400 mb-1.5">Specialization</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-sky-500"
                >
                  <option value="Engine Diagnostics & Overhaul">Engine Diagnostics & Overhaul</option>
                  <option value="Brake Systems & Suspension">Brake Systems & Suspension</option>
                  <option value="Electrical & Hybrid Systems">Electrical & Hybrid Systems</option>
                  <option value="Transmission & Drivetrain">Transmission & Drivetrain</option>
                  <option value="Climate Control & AC Overhaul">Climate Control & AC Overhaul</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sky-400 mb-1.5">Experience</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-sky-500"
                >
                  <option value="2-3 years">2-3 years</option>
                  <option value="4-6 years">4-6 years</option>
                  <option value="7-10 years">7-10 years</option>
                  <option value="10+ years">10+ years (Master Tech)</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 chars"
                  required
                  className="w-full bg-slate-900/90 border border-slate-750 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  className="w-full bg-slate-900/90 border border-slate-750 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <FaArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500 z-10">
        <Link to="/login" className="text-slate-400 hover:text-orange-400 transition-colors">
          Already have an account? Sign in here →
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;

