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
    <div className="bg-[#f8fafc] text-slate-900 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
          Factory Standard Maintenance
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Automotive Service Catalog
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Select from our certified multi-brand service packages. Every package includes OEM lubricants, computerized multi-point diagnostics, and transparent pricing.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 mb-10 shadow-sm shadow-slate-200/50 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by service or keywords..."
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline-flex items-center gap-1">
            <FaFilter className="w-3 h-3" /> Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-500/20"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
            className="bg-white border border-slate-200/90 hover:border-orange-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-sm hover:shadow-md shadow-slate-200/40 group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                  {service.category}
                </span>
                <span className="text-xs font-bold text-amber-700 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <FaStar className="w-3 h-3 text-amber-500" /> {service.rating}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                {service.name}
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <FaClock className="w-3.5 h-3.5 text-orange-600" />
                <span>Duration: {service.estimatedDuration}</span>
              </div>

              {/* Inclusions checklist preview */}
              <div className="space-y-1.5 mb-6 text-xs text-slate-700">
                {service.inclusions.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <FaCheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
                {service.inclusions.length > 3 && (
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="text-xs text-orange-600 hover:text-orange-700 font-semibold pt-1 cursor-pointer"
                  >
                    +{service.inclusions.length - 3} more checklist items →
                  </button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Standard Price</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{service.price.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalService(service)}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-xl transition-colors cursor-pointer"
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
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <p className="text-slate-500 text-sm">No services found matching "{search}".</p>
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
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">Category:</span>
                <span className="font-bold text-orange-600">{activeModalService.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Estimated Time:</span>
                <span className="font-bold text-slate-800">{activeModalService.estimatedDuration}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Upfront Cost:</span>
                <span className="font-extrabold text-lg text-emerald-600">
                  ₹{activeModalService.price.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Service Description</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeModalService.description}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2">Checklist & Inclusions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeModalService.inclusions.map((inc, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"
                  >
                    <FaCheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-800 flex items-center gap-2">
              <FaShieldAlt className="w-4 h-4 shrink-0 text-orange-600" />
              <span>Includes 1000 km / 1-Month VV Cars Quality Warranty on parts and labor.</span>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveModalService(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl cursor-pointer"
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
