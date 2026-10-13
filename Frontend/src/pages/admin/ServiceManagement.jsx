import React, { useState, useEffect } from "react";
import { storageService } from "../../utils/storage";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaWrench,
  FaClock,
  FaRupeeSign,
  FaCheckCircle,
} from "react-icons/fa";

export const ServiceManagement = () => {
  const { addToast } = useToast();
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "General Maintenance",
    price: 1999,
    estimatedDuration: "2 Hours",
    description: "",
    inclusions: "",
    status: "Active",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    setServices(storageService.getServices());
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      name: "",
      category: "General Maintenance",
      price: 1999,
      estimatedDuration: "2 - 3 Hours",
      description: "",
      inclusions: "Comprehensive multi-point inspection\nFluid level check\nDiagnostic scan report",
      status: "Active",
    });
    setIsAddEditOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      price: service.price,
      estimatedDuration: service.estimatedDuration,
      description: service.description,
      inclusions: Array.isArray(service.inclusions) ? service.inclusions.join("\n") : "",
      status: service.status || "Active",
    });
    setIsAddEditOpen(true);
  };

  const handleDeleteService = (service) => {
    if (window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
      const all = storageService.getServices();
      const updated = all.filter((s) => s.id !== service.id);
      storageService.setServices(updated);
      loadServices();
      addToast(`Deleted "${service.name}" from catalog`, "info");
    }
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      addToast("Please fill in required fields", "error");
      return;
    }

    const all = storageService.getServices();
    const inclusionsArray = formData.inclusions
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingService) {
      const updated = all.map((s) =>
        s.id === editingService.id
          ? {
              ...s,
              ...formData,
              price: Number(formData.price),
              inclusions: inclusionsArray,
            }
          : s
      );
      storageService.setServices(updated);
      addToast(`Updated package "${formData.name}"`, "success");
    } else {
      const newService = {
        id: `srv-${Date.now().toString().slice(-4)}`,
        ...formData,
        price: Number(formData.price),
        inclusions: inclusionsArray,
        rating: 5.0,
        bookingsCount: 0,
      };
      storageService.setServices([newService, ...all]);
      addToast(`Added new package "${formData.name}"`, "success");
    }

    setIsAddEditOpen(false);
    loadServices();
  };

  const categories = ["all", ...new Set(services.map((s) => s.category))];

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#182234] border border-slate-750/70 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Service Catalog Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure vehicle maintenance packages, inclusions, labor duration, and transparent pricing.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <FaPlus className="w-3.5 h-3.5" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#182234] border border-slate-750/70 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-lg">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service name, description..."
            className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border capitalize transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-[#182234] border border-slate-750/70 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative group hover:border-orange-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  {service.category}
                </span>
                <Badge size="xs">{service.status || "Active"}</Badge>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-3">
                {service.description}
              </p>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2 mb-4 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <FaClock className="text-orange-400" /> Duration:
                  </span>
                  <span className="font-semibold text-white">{service.estimatedDuration}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Price:</span>
                  <span className="text-base font-extrabold text-orange-400">
                    ₹{service.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Inclusions summary */}
              <div className="space-y-1 mb-4 text-[11px] text-slate-300">
                <p className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-1.5">
                  Checklist ({service.inclusions?.length || 0} items)
                </p>
                {service.inclusions?.slice(0, 3).map((inc, i) => (
                  <div key={i} className="flex items-center gap-1.5 truncate">
                    <FaCheckCircle className="text-emerald-400 w-3 h-3 shrink-0" />
                    <span className="truncate">{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">{service.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(service)}
                  title="Edit Package"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-750 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FaEdit className="w-3 h-3 text-orange-400" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteService(service)}
                  title="Delete Package"
                  className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors cursor-pointer"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <EmptyState
          icon={FaWrench}
          title="No Services Found"
          description="No packages match your search filter."
        />
      )}

      {/* Add / Edit Modal */}
      {isAddEditOpen && (
        <Modal
          isOpen={isAddEditOpen}
          onClose={() => setIsAddEditOpen(false)}
          title={editingService ? `Edit Service: ${editingService.name}` : "Create Service Package"}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveService} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Package Title *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Full Synthetic Engine Tuneup"
                className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
                >
                  <option value="General Maintenance">General Maintenance</option>
                  <option value="Brakes & Safety">Brakes & Safety</option>
                  <option value="Engine & Diagnostics">Engine & Diagnostics</option>
                  <option value="AC & Climate">AC & Climate</option>
                  <option value="Electrical & Battery">Electrical & Battery</option>
                  <option value="Detailing & Bodywork">Detailing & Bodywork</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Standard Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Estimated Duration</label>
                <input
                  type="text"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                  placeholder="e.g. 2 - 3 Hours"
                  className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Availability Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive description of parts and labor included..."
                className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500 custom-scroll"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Included Checklist Items (one item per line)
              </label>
              <textarea
                rows={3}
                value={formData.inclusions}
                onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                placeholder="Synthetic oil replacement&#10;Oil filter change&#10;Brake fluid check"
                className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500 custom-scroll font-mono"
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddEditOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                {editingService ? "Save Changes" : "Create Package"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ServiceManagement;

