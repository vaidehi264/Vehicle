import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { storageService } from "../../utils/storage";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import {
  FaCar,
  FaPlus,
  FaEdit,
  FaTrash,
  FaGasPump,
  FaTachometerAlt,
  FaCalendarAlt,
  FaCalendarPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export const VehicleManagement = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [vehicles, setVehicles] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [formData, setFormData] = useState({
    make: "Hyundai",
    model: "Creta",
    year: 2022,
    registrationNumber: "KA 01 MJ 8472",
    fuelType: "Petrol",
    mileage: "35,000 km",
    transmission: "Automatic",
    color: "White",
  });

  useEffect(() => {
    loadVehicles();
    const handleUpdate = () => loadVehicles();
    window.addEventListener("autoserve_storage_update", handleUpdate);
    return () => window.removeEventListener("autoserve_storage_update", handleUpdate);
  }, [currentUser]);

  const loadVehicles = () => {
    const all = storageService.getVehicles();
    const userId = currentUser?.id || "usr-001";
    setVehicles(all.filter((v) => v.userId === userId));
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      make: "Honda",
      model: "City",
      year: 2021,
      registrationNumber: "KA 05 MN 3020",
      fuelType: "Petrol",
      mileage: "28,000 km",
      transmission: "Manual",
      color: "Silver",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (veh) => {
    setEditingVehicle(veh);
    setFormData({
      make: veh.make,
      model: veh.model,
      year: veh.year,
      registrationNumber: veh.registrationNumber,
      fuelType: veh.fuelType || "Petrol",
      mileage: veh.mileage || "30,000 km",
      transmission: veh.transmission || "Automatic",
      color: veh.color || "Black",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (veh) => {
    if (window.confirm(`Delete ${veh.make} ${veh.model} (${veh.registrationNumber}) from your garage?`)) {
      const all = storageService.getVehicles();
      const updated = all.filter((v) => v.id !== veh.id);
      storageService.setVehicles(updated);
      loadVehicles();
      addToast(`Removed ${veh.make} ${veh.model} from your garage`, "info");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.make.trim() || !formData.model.trim() || !formData.registrationNumber.trim()) {
      addToast("Please fill in make, model and registration number", "error");
      return;
    }

    const all = storageService.getVehicles();
    const userId = currentUser?.id || "usr-001";

    if (editingVehicle) {
      const updated = all.map((v) =>
        v.id === editingVehicle.id ? { ...v, ...formData } : v
      );
      storageService.setVehicles(updated);
      addToast(`Updated ${formData.make} ${formData.model}`, "success");
    } else {
      const newVeh = {
        id: `veh-${Date.now().toString().slice(-4)}`,
        userId: userId,
        ...formData,
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400",
        lastServiceDate: new Date().toISOString().split("T")[0],
      };
      storageService.setVehicles([newVeh, ...all]);
      addToast(`Added ${formData.make} ${formData.model} to your garage!`, "success");
    }

    setIsModalOpen(false);
    loadVehicles();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl shadow-sm shadow-slate-200/50">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Garage & Vehicles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Register your vehicles to book scheduled maintenance and track vehicle health history.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <FaPlus className="w-3.5 h-3.5" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((veh) => (
          <div
            key={veh.id}
            className="bg-white border border-slate-200/90 hover:border-orange-500/50 rounded-3xl p-6 shadow-sm hover:shadow-md shadow-slate-200/40 space-y-4 flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-slate-200">
                <img
                  src={veh.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400"}
                  alt={veh.model}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-orange-600 border border-slate-200 shadow-sm">
                  {veh.registrationNumber}
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {veh.make} {veh.model}
                  </h3>
                  <p className="text-xs text-slate-500">Model Year: {veh.year}</p>
                </div>
              </div>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 gap-2 pt-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <FaGasPump className="text-orange-600 w-3.5 h-3.5" />
                  <span className="text-slate-700">{veh.fuelType}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <FaTachometerAlt className="text-sky-600 w-3.5 h-3.5" />
                  <span className="text-slate-700">{veh.mileage || "30,000 km"}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <Link
                to={`/user/book-service?vehicleId=${veh.id}`}
                className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <FaCalendarPlus className="w-3 h-3" />
                <span>Book Service</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(veh)}
                  title="Edit Vehicle"
                  className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  <FaEdit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(veh)}
                  title="Delete Vehicle"
                  className="p-2 text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {vehicles.length === 0 && (
        <EmptyState
          icon={FaCar}
          title="No Vehicles in Garage"
          description="You haven't registered any vehicles yet. Add your car to schedule seamless service bookings."
          actionText="Add Your First Car"
          onAction={openAddModal}
        />
      )}

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingVehicle ? `Edit ${editingVehicle.make} ${editingVehicle.model}` : "Register Vehicle"}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Car Make *</label>
                <input
                  type="text"
                  required
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  placeholder="e.g. Hyundai, Honda, BMW"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Model *</label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g. Creta SX, City ZX"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Model Year *</label>
                <input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Registration Number *</label>
                <input
                  type="text"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. KA 01 MJ 8472"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 font-mono font-bold transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Fuel Type</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric (EV)</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Mileage</label>
                <input
                  type="text"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  placeholder="e.g. 35,000 km"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                {editingVehicle ? "Save Changes" : "Save to Garage"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default VehicleManagement;
