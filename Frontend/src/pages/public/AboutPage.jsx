import React from "react";
import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaAward,
  FaTools,
  FaCheckDouble,
  FaUsers,
  FaWarehouse,
  FaArrowRight,
} from "react-icons/fa";

export const AboutPage = () => {
  return (
    <div className="bg-[#f8fafc] text-slate-900 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero / Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
          Our Story & Commitment
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Revolutionizing Multi-Brand Automotive Service
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          VV Cars was created to solve the two biggest complaints in car servicing: lack of transparent pricing and inconsistent repair craftsmanship.
        </p>
      </div>

      {/* Grid of 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm shadow-slate-200/50">
          <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center">
            <FaShieldAlt className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Genuine OEM Parts</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            100% manufacturer-specified oils, filters, brake pads, and electronic components directly procured from certified suppliers.
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm shadow-slate-200/50">
          <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
            <FaTools className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Certified Technicians</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every technician is tested on modern OBD-II diagnostic toolsets, hybrid battery modules, and powertrain overhauls before joining.
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm shadow-slate-200/50">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <FaCheckDouble className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Transparent Pricing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No surprise estimates or hidden billing. You approve all diagnostic findings and estimates digitally before work begins.
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm shadow-slate-200/50">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
            <FaAward className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">1,000 km Warranty</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We stand completely behind our craftsmanship with an unconditional 1000 km / 30-day warranty on all completed jobs.
          </p>
        </div>
      </div>

      {/* Network Stats Section */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm shadow-slate-200/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Nationwide Multi-City Garage Infrastructure
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              With service centers strategically positioned across Gandhinagar, Ahmedabad, Mumbai, Pune, Hyderabad, and Delhi NCR, VV Cars ensures fast doorstep vehicle pickup and guaranteed bay availability.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                to="/services"
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
              >
                <span>View All Services</span>
                <FaArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
              <h4 className="text-3xl font-black text-slate-900">120+</h4>
              <p className="text-xs text-slate-500 font-semibold mt-1">Authorized Garages</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
              <h4 className="text-3xl font-black text-orange-600">450+</h4>
              <p className="text-xs text-slate-500 font-semibold mt-1">Certified Mechanics</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
              <h4 className="text-3xl font-black text-emerald-600">99.2%</h4>
              <p className="text-xs text-slate-500 font-semibold mt-1">On-Time Delivery</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
              <h4 className="text-3xl font-black text-sky-600">15,000+</h4>
              <p className="text-xs text-slate-500 font-semibold mt-1">Vehicles Handled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
