import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import BrandLogo from "../components/common/BrandLogo";
import { useAuth } from "../context/AuthContext";
import {
  FaBars,
  FaTimes,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";

export const PublicLayout = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  const getDashboardPath = () => {
    if (!currentUser) return "/login";
    if (currentUser.role === "admin") return "/admin/dashboard";
    if (currentUser.role === "mechanic") return "/mechanic/dashboard";
    return "/user/dashboard";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      {/* Top Banner */}
      <div className="bg-slate-100 border-b border-slate-200 text-xs text-slate-600 py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-orange-600 font-semibold">
              <FaPhoneAlt className="w-3 h-3" /> 24/7 Breakdown Hotline: 1800-419-AUTO
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-500">
              <FaMapMarkerAlt className="w-3 h-3 text-slate-400" /> Over 120+ Verified Garages Across India
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-slate-500">Certified OEM Multi-brand Maintenance</span>
            <Link to="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
              Demo Credentials Available →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <BrandLogo />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-orange-600 ${
                    isActive ? "text-orange-600 font-semibold" : "text-slate-600"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-sm font-medium rounded-xl transition-all"
                >
                  <img
                    src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-orange-500"
                  />
                  <span>Dashboard ({currentUser.role})</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>Book Service</span>
                  <FaArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg bg-slate-100 border border-slate-200 cursor-pointer"
            >
              {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 hover:text-orange-600 font-medium text-base"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
              {isAuthenticated && currentUser ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center bg-orange-600 text-white rounded-xl font-medium"
                  >
                    Go to Dashboard ({currentUser.role})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate("/login");
                    }}
                    className="w-full py-2 text-center text-rose-600 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center border border-slate-200 bg-slate-100 text-slate-800 rounded-xl font-medium"
                  >
                    Sign In (Demo Accounts)
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center bg-orange-600 text-white rounded-xl font-medium shadow-md shadow-orange-500/20"
                  >
                    Get Started / Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Col 1 */}
            <div className="space-y-4">
              <BrandLogo />
              <p className="text-sm leading-relaxed text-slate-500">
                India's premier digital auto-maintenance network connecting vehicle owners with vetted master mechanics, transparent pricing, and doorstep pickup.
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <FaShieldAlt className="w-3.5 h-3.5" /> 1000 km Warranty
                </span>
                <span>•</span>
                <span>100% Genuine Parts</span>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-slate-900 font-bold text-sm tracking-wider uppercase mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/" className="hover:text-orange-600 transition-colors">Home Portal</Link></li>
                <li><Link to="/services" className="hover:text-orange-600 transition-colors">Service Packages</Link></li>
                <li><Link to="/about" className="hover:text-orange-600 transition-colors">About Our Network</Link></li>
                <li><Link to="/contact" className="hover:text-orange-600 transition-colors">Support & Help Desk</Link></li>
                <li><Link to="/login" className="hover:text-orange-600 transition-colors">Demo Portal Sign In</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-slate-900 font-bold text-sm tracking-wider uppercase mb-4">Popular Services</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/services" className="hover:text-orange-600 transition-colors">Periodic Maintenance</Link></li>
                <li><Link to="/services" className="hover:text-orange-600 transition-colors">Brake Pad & Rotor Repair</Link></li>
                <li><Link to="/services" className="hover:text-orange-600 transition-colors">OBD-II Scanning Diagnostics</Link></li>
                <li><Link to="/services" className="hover:text-orange-600 transition-colors">AC Gas Refill & Sanitization</Link></li>
                <li><Link to="/services" className="hover:text-orange-600 transition-colors">Ceramic Coating 9H Graphene</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-4">
              <h4 className="text-slate-900 font-bold text-sm tracking-wider uppercase mb-4">Support & Office</h4>
              <p className="text-sm flex items-start gap-2.5 text-slate-600">
                <FaMapMarkerAlt className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
                <span>AutoServe Innovation Park, Outer Ring Road, Bellandur, Bangalore 560103</span>
              </p>
              <p className="text-sm flex items-center gap-2.5 text-slate-600">
                <FaPhoneAlt className="w-4 h-4 text-orange-600 shrink-0" />
                <span>+91 (080) 4120-7799</span>
              </p>
              <p className="text-sm flex items-center gap-2.5 text-slate-600">
                <FaEnvelope className="w-4 h-4 text-orange-600 shrink-0" />
                <span>support@autoserve.com</span>
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} AutoServe Technologies Pvt. Ltd. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-slate-700 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-700 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-700 cursor-pointer">Mechanic Code of Conduct</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
