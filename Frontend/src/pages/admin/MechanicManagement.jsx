import React, { useState, useEffect } from "react";
import { storageService } from "../../utils/storage";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import {
  FaSearch,
  FaUserPlus,
  FaEdit,
  FaEye,
  FaCheck,
  FaTimes,
  FaStar,
  FaWrench,
  FaPhone,
  FaEnvelope,
  FaRupeeSign,
  FaClock,
} from "react-icons/fa";

export const MechanicManagement = () => {
  const { addToast } = useToast();
  const [mechanics, setMechanics] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingMechanic, setEditingMechanic] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "Engine Diagnostics & Overhaul",
    experience: "5 years",
    hourlyRate: 750,
    workingHours: "09:00 AM - 07:00 PM",
    availability: "Available",
    status: "Approved",
    bio: "",
  });

  useEffect(() => {
    loadMechanics();
  }, []);

  const loadMechanics = () => {
    setMechanics(storageService.getMechanics());
  };

  const handleApproveReject = (mechanic, newStatus) => {
    const all = storageService.getMechanics();
    const updated = all.map((m) =>
      m.id === mechanic.id ? { ...m, status: newStatus } : m
    );
    storageService.setMechanics(updated);
    loadMechanics();
    addToast(
      `Mechanic ${mechanic.name} application marked as ${newStatus}`,
      newStatus === "Approved" ? "success" : "error"
    );
  };

  const openAddModal = () => {
    setEditingMechanic(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      specialization: "Engine Diagnostics & Overhaul",
      experience: "5 years",
      hourlyRate: 750,
      workingHours: "09:00 AM - 07:00 PM",
      availability: "Available",
      status: "Approved",
      bio: "",
    });
    setIsAddEditOpen(true);
  };

  const openEditModal = (mech) => {
    setEditingMechanic(mech);
    setFormData({
      name: mech.name,
      email: mech.email,
      phone: mech.phone || "",
      specialization: mech.specialization || "General Automotive Repair",
      experience: mech.experience || "3 years",
      hourlyRate: mech.hourlyRate || 650,
      workingHours: mech.workingHours || "09:00 AM - 07:00 PM",
      availability: mech.availability || "Available",
      status: mech.status || "Approved",
      bio: mech.bio || "",
    });
    setIsAddEditOpen(true);
  };

  const handleSaveMechanic = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      addToast("Please fill in required fields", "error");
      return;
    }

    const all = storageService.getMechanics();

    if (editingMechanic) {
      const updated = all.map((m) =>
        m.id === editingMechanic.id ? { ...m, ...formData } : m
      );
      storageService.setMechanics(updated);
      addToast(`Updated profile for ${formData.name}`, "success");
    } else {
      const newMech = {
        id: `mech-${Date.now().toString().slice(-4)}`,
        ...formData,
        rating: 5.0,
        reviewsCount: 0,
        completedJobs: 0,
        earningsThisMonth: 0,
        totalEarnings: 0,
        skills: ["General Service", "Multi-point Scan"],
        avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100",
      };
      storageService.setMechanics([newMech, ...all]);
      addToast(`Added new technician ${formData.name}`, "success");
    }

    setIsAddEditOpen(false);
    loadMechanics();
  };

  const filteredMechanics = mechanics.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.specialization.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || m.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl shadow-sm shadow-slate-200/50">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Mechanic Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered technicians, specializations, hourly wage, performance ratings, and onboarding approval.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <FaUserPlus className="w-3.5 h-3.5" />
          <span>Onboard New Mechanic</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-sm shadow-slate-200/50">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, specialization..."
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold mr-1">Application:</span>
          {["all", "approved", "pending", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Technician</th>
                <th className="py-3.5 px-4">Specialization</th>
                <th className="py-3.5 px-4">Experience & Rating</th>
                <th className="py-3.5 px-4">Bay Duty Status</th>
                <th className="py-3.5 px-4">Approval Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMechanics.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatar || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100"}
                        alt={m.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{m.name}</p>
                        <p className="text-[11px] text-slate-500">{m.email}</p>
                        <p className="text-[10px] text-slate-500">{m.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-orange-600">{m.specialization}</p>
                    <p className="text-[11px] text-slate-500">₹{m.hourlyRate}/hr base rate</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-slate-700 font-medium">{m.experience}</p>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs mt-0.5">
                      <FaStar className="w-3 h-3 text-amber-500" />
                      <span>{m.rating || "5.0"}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({m.reviewsCount || 0} reviews)</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge size="xs">{m.availability}</Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge size="xs">{m.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Approve / Reject buttons if Pending */}
                      {m.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApproveReject(m, "Approved")}
                            title="Approve Application"
                            className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                          >
                            <FaCheck className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleApproveReject(m, "Rejected")}
                            title="Reject Application"
                            className="p-2 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setSelectedMechanic(m)}
                        title="View Profile"
                        className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors cursor-pointer"
                      >
                        <FaEye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => openEditModal(m)}
                        title="Edit Details"
                        className="p-2 text-slate-600 hover:text-orange-600 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors cursor-pointer"
                      >
                        <FaEdit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMechanics.length === 0 && (
          <EmptyState
            icon={FaWrench}
            title="No Mechanics Found"
            description="No technicians match your search query."
          />
        )}
      </div>

      {/* Details Modal */}
      {selectedMechanic && (
        <Modal
          isOpen={!!selectedMechanic}
          onClose={() => setSelectedMechanic(null)}
          title={`Technician Profile: ${selectedMechanic.name}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={selectedMechanic.avatar}
                alt={selectedMechanic.name}
                className="w-16 h-16 rounded-2xl object-cover border border-sky-300"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedMechanic.name}</h4>
                <p className="text-xs text-orange-600 font-semibold">{selectedMechanic.specialization}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge size="xs">{selectedMechanic.status}</Badge>
                  <Badge size="xs">{selectedMechanic.availability}</Badge>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
              "{selectedMechanic.bio || "Certified technician dedicated to precision diagnosis and preventative vehicle longevity."}"
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Experience:</span>
                <span className="font-bold text-slate-900">{selectedMechanic.experience}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Customer Rating:</span>
                <span className="font-bold text-amber-600">★ {selectedMechanic.rating || "5.0"} ({selectedMechanic.completedJobs || 120}+ jobs)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Hourly Rate:</span>
                <span className="font-bold text-emerald-600">₹{selectedMechanic.hourlyRate}/hr</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Working Hours:</span>
                <span className="font-bold text-slate-900">{selectedMechanic.workingHours}</span>
              </div>
            </div>

            {selectedMechanic.skills && selectedMechanic.skills.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1.5">Assessed Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMechanic.skills.map((s, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedMechanic(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Modal */}
      {isAddEditOpen && (
        <Modal
          isOpen={isAddEditOpen}
          onClose={() => setIsAddEditOpen(false)}
          title={editingMechanic ? `Edit Profile: ${editingMechanic.name}` : "Onboard New Mechanic"}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveMechanic} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Balwinder Singh"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tech@vvcars.com"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98450 00000"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Specialization</label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
              >
                <option value="Engine Diagnostics & Overhaul">Engine Diagnostics & Overhaul</option>
                <option value="Brake Systems & Suspension">Brake Systems & Suspension</option>
                <option value="Electrical & Hybrid Systems">Electrical & Hybrid Systems</option>
                <option value="Transmission & Drivetrain">Transmission & Drivetrain</option>
                <option value="Climate Control & AC Overhaul">Climate Control & AC Overhaul</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g. 7 years"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hourly Rate (₹)</label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Approval Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddEditOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                {editingMechanic ? "Save Changes" : "Save Mechanic"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MechanicManagement;
