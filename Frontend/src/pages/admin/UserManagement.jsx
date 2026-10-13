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
  FaToggleOn,
  FaToggleOff,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCar,
  FaCalendarAlt,
} from "react-icons/fa";

export const UserManagement = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [selectedUser, setSelectedUser] = useState(null); // Details modal
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // If null -> Add, else -> Edit

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const all = storageService.getUsers();
    // Filter only role === 'user' for customer management
    setUsers(all.filter((u) => u.role === "user"));
  };

  const handleToggleStatus = (user) => {
    const updatedStatus = user.status === "active" ? "inactive" : "active";
    const allUsers = storageService.getUsers();
    const updated = allUsers.map((u) =>
      u.id === user.id ? { ...u, status: updatedStatus } : u
    );
    storageService.setUsers(updated);
    loadUsers();
    addToast(
      `User ${user.name} is now ${updatedStatus.toUpperCase()}`,
      updatedStatus === "active" ? "success" : "warning"
    );
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "active",
    });
    setIsAddEditOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      status: user.status || "active",
    });
    setIsAddEditOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      addToast("Please fill in required fields", "error");
      return;
    }

    const allUsers = storageService.getUsers();

    if (editingUser) {
      // Edit
      const updated = allUsers.map((u) =>
        u.id === editingUser.id ? { ...u, ...formData } : u
      );
      storageService.setUsers(updated);
      addToast(`Updated profile for ${formData.name}`, "success");
    } else {
      // Add
      const newUser = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        ...formData,
        role: "user",
        joinedDate: new Date().toISOString().split("T")[0],
        vehiclesCount: 0,
        bookingsCount: 0,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      };
      storageService.setUsers([newUser, ...allUsers]);
      addToast(`Added new user ${formData.name}`, "success");
    }

    setIsAddEditOpen(false);
    loadUsers();
  };

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));
    const matchesStatus =
      statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#182234] border border-slate-750/70 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            User Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered vehicle owners, contact details, account access status, and booking history.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <FaUserPlus className="w-3.5 h-3.5" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#182234] border border-slate-750/70 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-lg">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold mr-1">Status:</span>
          {["all", "active", "inactive"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#182234] border border-slate-750/70 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Vehicles</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-white text-sm">{u.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-slate-300 font-medium">{u.email}</p>
                    <p className="text-[11px] text-slate-400">{u.phone || "No phone"}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-300">
                      {u.vehiclesCount ?? 1} Registered
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {u.joinedDate || "2025-01-15"}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge size="xs">{u.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedUser(u)}
                        title="View Details"
                        className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-750 transition-colors cursor-pointer"
                      >
                        <FaEye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => openEditModal(u)}
                        title="Edit Customer"
                        className="p-2 text-slate-400 hover:text-orange-400 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-750 transition-colors cursor-pointer"
                      >
                        <FaEdit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(u)}
                        title={u.status === "active" ? "Deactivate User" : "Activate User"}
                        className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                          u.status === "active"
                            ? "text-emerald-400 hover:text-rose-400 bg-emerald-500/10 border-emerald-500/20"
                            : "text-rose-400 hover:text-emerald-400 bg-rose-500/10 border-rose-500/20"
                        }`}
                      >
                        {u.status === "active" ? (
                          <FaToggleOn className="w-4 h-4" />
                        ) : (
                          <FaToggleOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <EmptyState
            icon={FaUser}
            title="No Users Found"
            description="No customers match your search criteria or status filter."
          />
        )}
      </div>

      {/* View User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`Customer Profile: ${selectedUser.name}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-16 h-16 rounded-2xl object-cover border border-orange-500/40"
              />
              <div>
                <h4 className="text-base font-bold text-white">{selectedUser.name}</h4>
                <p className="text-xs text-orange-400 font-mono">{selectedUser.id}</p>
                <div className="mt-1">
                  <Badge size="xs">{selectedUser.status}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <FaEnvelope className="text-orange-400" /> Email
                </span>
                <p className="font-bold text-white truncate">{selectedUser.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <FaPhone className="text-orange-400" /> Phone
                </span>
                <p className="font-bold text-white">{selectedUser.phone || "Not provided"}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <FaCalendarAlt className="text-orange-400" /> Member Since
                </span>
                <p className="font-bold text-white">{selectedUser.joinedDate || "2025-01-15"}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <FaCar className="text-orange-400" /> Vehicles Registered
                </span>
                <p className="font-bold text-white">{selectedUser.vehiclesCount ?? 1} Vehicles</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                <FaMapMarkerAlt className="text-orange-400" /> Registered Garage Address
              </span>
              <p className="text-slate-200">{selectedUser.address || "Bengaluru, Karnataka, India"}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit User Modal */}
      {isAddEditOpen && (
        <Modal
          isOpen={isAddEditOpen}
          onClose={() => setIsAddEditOpen(false)}
          title={editingUser ? `Edit Customer: ${editingUser.name}` : "Add New Customer"}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveUser} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Saxena"
                className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ramesh@example.com"
                className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address / Locality"
                className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Account Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-900 border border-slate-750 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-orange-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
                {editingUser ? "Save Changes" : "Create User"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;

