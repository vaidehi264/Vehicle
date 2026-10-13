import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { storageService } from "../../utils/storage";
import Modal from "../../components/common/Modal";
import {
  FaSearch,
  FaWrench,
  FaStar,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaFilter,
  FaShieldAlt,
} from "react-icons/fa";

export const ServicesPage = () => {
  const navigate = useNavigate();
  const services = storageService.getServices();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeModalService, setActiveModalService] = useState(null);

  const categories = ["All", ...new Set(services.map((s) => s.category))];

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#0b1120] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Factory Standard Maintenance
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Automotive Service Catalog
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Select from our certified multi-brand service packages. Every package includes OEM lubricants, computerized multi-point diagnostics, and transparent pricing.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#182234] border border-slate-800 rounded-2xl p-4 sm:p-5 mb-10 shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by service or keywords..."
            className="w-full bg-slate-900 border border-slate-750 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline flex items-center gap-1">
            <FaFilter className="w-3 h-3" /> Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-[#182234] border border-slate-800 hover:border-orange-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-lg shadow-black/20 group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  {service.category}
                </span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                  <FaStar className="w-3 h-3" /> {service.rating}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                {service.name}
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                <FaClock className="w-3.5 h-3.5 text-orange-400" />
                <span>Duration: {service.estimatedDuration}</span>
              </div>

              {/* Inclusions checklist preview */}
              <div className="space-y-1.5 mb-6 text-xs text-slate-300">
                {service.inclusions.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <FaCheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
                {service.inclusions.length > 3 && (
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="text-xs text-orange-400 hover:text-orange-300 font-semibold pt-1 cursor-pointer"
                  >
                    +{service.inclusions.length - 3} more checklist items →
                  </button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Standard Price</span>
                <span className="text-2xl font-black text-white">
                  ₹{service.price.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalService(service)}
                  className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Details
                </button>
                <Link
                  to={`/user/book-service?serviceId=${service.id}`}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-16 bg-[#182234]/40 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-sm">No services found matching "{search}".</p>
        </div>
      )}

      {/* Details Modal */}
      {activeModalService && (
        <Modal
          isOpen={!!activeModalService}
          onClose={() => setActiveModalService(null)}
          title={activeModalService.name}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Category:</span>
                <span className="font-bold text-orange-400">{activeModalService.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Estimated Time:</span>
                <span className="font-bold text-white">{activeModalService.estimatedDuration}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Upfront Cost:</span>
                <span className="font-extrabold text-lg text-emerald-400">
                  ₹{activeModalService.price.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-1">Service Description</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeModalService.description}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2">Checklist & Inclusions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeModalService.inclusions.map((inc, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200"
                  >
                    <FaCheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300 flex items-center gap-2">
              <FaShieldAlt className="w-4 h-4 shrink-0" />
              <span>Includes 1000 km / 1-Month AutoServe Quality Warranty on parts and labor.</span>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveModalService(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const sId = activeModalService.id;
                  setActiveModalService(null);
                  navigate(`/user/book-service?serviceId=${sId}`);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                Schedule This Package →
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ServicesPage;

