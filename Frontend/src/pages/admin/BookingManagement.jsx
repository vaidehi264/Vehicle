import React, { useState, useEffect } from "react";
import { storageService } from "../../utils/storage";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import {
  FaSearch,
  FaCalendarCheck,
  FaUserCheck,
  FaEye,
  FaEdit,
} from "react-icons/fa";

export const BookingManagement = () => {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [selectedBooking, setSelectedBooking] = useState(null); // Details modal
  const [assignModalBooking, setAssignModalBooking] = useState(null); // Assign mechanic modal
  const [selectedMechanicId, setSelectedMechanicId] = useState("");

  const [statusModalBooking, setStatusModalBooking] = useState(null); // Update status modal
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("autoserve_storage_update", handleUpdate);
    return () => window.removeEventListener("autoserve_storage_update", handleUpdate);
  }, []);

  const loadData = () => {
    setBookings(storageService.getBookings());
    setMechanics(storageService.getMechanics().filter((m) => m.status === "Approved"));
  };

  // Open assign mechanic modal
  const handleOpenAssign = (booking) => {
    setAssignModalBooking(booking);
    setSelectedMechanicId(booking.mechanicId || mechanics[0]?.id || "");
  };

  // Confirm assign mechanic
  const handleConfirmAssign = (e) => {
    e.preventDefault();
    if (!selectedMechanicId) return;

    const mechanic = mechanics.find((m) => m.id === selectedMechanicId);
    if (!mechanic) return;

    const allBookings = storageService.getBookings();
    const updated = allBookings.map((b) =>
      b.id === assignModalBooking.id
        ? {
            ...b,
            mechanicId: mechanic.id,
            mechanicName: mechanic.name,
            mechanicPhone: mechanic.phone,
            status: b.status === "Pending" ? "Assigned" : b.status,
            serviceNotes: b.serviceNotes
              ? `${b.serviceNotes}\nAssigned to ${mechanic.name}`
              : `Assigned to ${mechanic.name} by workshop manager.`,
          }
        : b
    );

    storageService.setBookings(updated);
    addToast(
      `Assigned ${mechanic.name} to booking ${assignModalBooking.id}`,
      "success"
    );
    setAssignModalBooking(null);
    loadData();
  };

  // Open status modal
  const handleOpenStatusModal = (booking) => {
    setStatusModalBooking(booking);
    setNewStatus(booking.status);
  };

  // Confirm status update
  const handleConfirmStatus = (e) => {
    e.preventDefault();
    const allBookings = storageService.getBookings();
    const updated = allBookings.map((b) =>
      b.id === statusModalBooking.id
        ? {
            ...b,
            status: newStatus,
            ...(newStatus === "Completed" && {
              paymentStatus: "Paid",
              estimatedCompletionTime: "Completed",
            }),
          }
        : b
    );

    storageService.setBookings(updated);
    addToast(
      `Updated ${statusModalBooking.id} status to ${newStatus}`,
      "success"
    );
    setStatusModalBooking(null);
    loadData();
  };

  const statuses = [
    "all",
    "Pending",
    "Assigned",
    "Accepted",
    "In Progress",
    "Completed",
    "Cancelled",
  ];

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      (b.vehicleDetails?.registrationNumber &&
        b.vehicleDetails.registrationNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || b.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-6 rounded-3xl shadow-sm shadow-slate-200/50">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Booking & Job Operations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch master mechanics, monitor workshop job status, inspect diagnostics, and track vehicle progress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200">
            Total {bookings.length} Bookings Logged
          </span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-sm shadow-slate-200/50">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking ID, customer, reg no..."
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold mr-1">Status:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border capitalize transition-all cursor-pointer ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Customer & Vehicle</th>
                <th className="py-3.5 px-4">Service & Slot</th>
                <th className="py-3.5 px-4">Assigned Mechanic</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Cost</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-orange-600">
                    {b.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 text-sm">{b.customerName}</p>
                    <p className="text-[11px] text-slate-500">
                      {b.vehicleDetails?.make} {b.vehicleDetails?.model}
                    </p>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {b.vehicleDetails?.registrationNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{b.serviceName}</p>
                    <p className="text-[11px] text-slate-500">{b.bookingDate} • {b.timeSlot}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    {b.mechanicName && b.mechanicName !== "Unassigned" ? (
                      <div>
                        <p className="font-bold text-sky-700">{b.mechanicName}</p>
                        <p className="text-[10px] text-slate-500">{b.mechanicPhone}</p>
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-700 font-semibold italic">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge size="xs">{b.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                    ₹{b.serviceCost.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Assign mechanic button */}
                      <button
                        onClick={() => handleOpenAssign(b)}
                        title="Assign Mechanic"
                        className="p-2 text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
                      >
                        <FaUserCheck className="w-3.5 h-3.5" />
                      </button>

                      {/* Update status button */}
                      <button
                        onClick={() => handleOpenStatusModal(b)}
                        title="Change Status"
                        className="p-1.5 text-orange-700 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors cursor-pointer"
                      >
                        <FaEdit className="w-3 h-3" />
                      </button>

                      {/* View details */}
                      <button
                        onClick={() => setSelectedBooking(b)}
                        title="View Full Booking"
                        className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                      >
                        <FaEye className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <EmptyState
            icon={FaCalendarCheck}
            title="No Bookings Match"
            description="Try adjusting your status filter or search parameters."
          />
        )}
      </div>

      {/* Assign Mechanic Modal */}
      {assignModalBooking && (
        <Modal
          isOpen={!!assignModalBooking}
          onClose={() => setAssignModalBooking(null)}
          title={`Assign Mechanic — ${assignModalBooking.id}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleConfirmAssign} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">Customer: {assignModalBooking.customerName}</p>
              <p className="text-slate-500">
                Vehicle: {assignModalBooking.vehicleDetails?.make} {assignModalBooking.vehicleDetails?.model} ({assignModalBooking.vehicleDetails?.registrationNumber})
              </p>
              <p className="text-orange-600 font-semibold">{assignModalBooking.serviceName}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Choose Certified Master Mechanic
              </label>
              <select
                value={selectedMechanicId}
                onChange={(e) => setSelectedMechanicId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
              >
                {mechanics.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.specialization} ({m.availability})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAssignModalBooking(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                Confirm Mechanic Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Update Status Modal */}
      {statusModalBooking && (
        <Modal
          isOpen={!!statusModalBooking}
          onClose={() => setStatusModalBooking(null)}
          title={`Update Status — ${statusModalBooking.id}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleConfirmStatus} className="space-y-4">
            <p className="text-xs text-slate-600">
              Select the new progression stage for {statusModalBooking.customerName}'s vehicle service:
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Service Stage</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
              >
                <option value="Pending">Pending (Awaiting Bay)</option>
                <option value="Assigned">Assigned (Technician Allocated)</option>
                <option value="Accepted">Accepted (Mechanic Confirmed)</option>
                <option value="In Progress">In Progress (Bay Work Active)</option>
                <option value="Completed">Completed (Final QC & Wash Complete)</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setStatusModalBooking(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                Update Status
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Booking File: ${selectedBooking.id}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Booking Status</span>
                <div className="mt-1">
                  <Badge size="md">{selectedBooking.status}</Badge>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Service Fee</span>
                <p className="text-2xl font-black text-orange-600">
                  ₹{selectedBooking.serviceCost.toLocaleString()}
                </p>
                <span className="text-[10px] font-semibold text-emerald-600">
                  Payment: {selectedBooking.paymentStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-bold block mb-1">Customer Information</span>
                <p className="text-slate-900 font-bold">{selectedBooking.customerName}</p>
                <p className="text-slate-500">{selectedBooking.customerEmail}</p>
                <p className="text-slate-500">{selectedBooking.customerPhone}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-bold block mb-1">Vehicle Specifications</span>
                <p className="text-slate-900 font-bold">
                  {selectedBooking.vehicleDetails?.make} {selectedBooking.vehicleDetails?.model} ({selectedBooking.vehicleDetails?.year})
                </p>
                <p className="text-orange-600 font-mono font-bold">
                  {selectedBooking.vehicleDetails?.registrationNumber}
                </p>
                <p className="text-slate-500">Fuel: {selectedBooking.vehicleDetails?.fuelType}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-bold block mb-1">Scheduled Appointment</span>
              <p className="text-slate-900 font-medium">Date: {selectedBooking.bookingDate} • {selectedBooking.timeSlot}</p>
              <p className="text-slate-500">Pickup Mode: {selectedBooking.pickupType}</p>
              <p className="text-slate-500">Estimated Completion: {selectedBooking.estimatedCompletionTime}</p>
            </div>

            {selectedBooking.problemDescription && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-bold block">Reported Problem Description</span>
                <p className="text-slate-700 leading-relaxed">{selectedBooking.problemDescription}</p>
              </div>
            )}

            {selectedBooking.diagnosticFindings && (
              <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200 space-y-1">
                <span className="text-sky-700 font-bold block">Technician Diagnostic Findings</span>
                <p className="text-slate-700 leading-relaxed">{selectedBooking.diagnosticFindings}</p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookingManagement;
